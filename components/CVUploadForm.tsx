"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getApiKey } from "@/actions/saveApiKey";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ApiKeyModal } from "./ApiKeyModal";

type CVUploadFormProps = {
	onUpload: (oldCV: File) => void;
	handleRecomendations: (recomendations: string[]) => void;
	startTransition: (callback: () => void) => void;
	isPending: boolean;
};

const formSchema = z.object({
	cvOriginal: z
		.instanceof(File, {
			message: "CV file is required and must not be empty",
		})
		.refine((file) => file.size > 0, {
			message: "CV file is required and must not be empty",
		}),
	jobDescription: z.string().min(10).max(1500),
});

export default function CVUploadForm({
	onUpload,
	handleRecomendations,
	startTransition,
	isPending,
}: CVUploadFormProps) {
	const [showApiKeyModal, setShowApiKeyModal] = useState(false);
	const [hasApiKey, setHasApiKey] = useState(false);

	useEffect(() => {
		const checkApiKey = async () => {
			const apiKey = await getApiKey();
			setHasApiKey(!!apiKey); // Convert to boolean
			if (!apiKey) {
				setShowApiKeyModal(true); // Show the API key modal
			}
		};
		checkApiKey();
	}, []);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			cvOriginal: undefined,
			jobDescription: "",
		},
	});

	const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			onUpload(file);
		}
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Check if API key is available
		if (!hasApiKey) {
			setShowApiKeyModal(true);
			return;
		}

		const { cvOriginal, jobDescription } = values;
		try {
			const formData = new FormData();
			formData.append("cvOriginal", cvOriginal, cvOriginal.name);
			formData.append("jobDescription", jobDescription);

			startTransition(async () => {
				const response = await fetch("/api/pdf", {
					method: "POST",
					body: formData,
				});
				const {
					status,
					recomendations,
				}: {
					status: "success" | "error";
					recomendations: string[];
				} = await response.json();

				if (status === "success") {
					handleRecomendations(recomendations);
				}
			});
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6"
				encType="multipart/form-data"
			>
				<FormField
					control={form.control}
					name="cvOriginal"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="mb-2 block font-medium text-gray-200 text-sm">
								Upload your CV
							</FormLabel>
							<FormControl>
								<Input
									className="border-0 bg-white/20 text-white focus:ring-2 focus:ring-blue-400"
									type="file"
									accept=".txt,.pdf,.doc,.docx"
									onChange={(e) => {
										field.onChange(e.target.files?.[0]);
										handleCVUpload(e);
									}}
								/>
							</FormControl>
							<FormDescription className="text-gray-200">
								Suba su CV en formato PDF, DOC, DOCX o TXT
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="jobDescription"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="mb-2 block font-medium text-gray-200 text-sm">
								Job Description
							</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder="Paste the job description here..."
									rows={5}
									onInput={(e) => {
										const target = e.target as HTMLTextAreaElement;
										target.style.height = "auto"; // Reset height to calculate the new height
										target.style.height = `${target.scrollHeight}px`; // Set height based on content
									}}
									className="max-h-40 resize-none overflow-hidden border-0 bg-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400"
								/>
							</FormControl>
							<FormDescription className="text-gray-200">
								Ingrese la descripción de la oferta laboral
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
					disabled={isPending}
					type="submit"
				>
					{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{isPending ? "Generating..." : "Generate Recommendations"}
				</Button>
			</form>
			<ApiKeyModal
				isOpen={showApiKeyModal}
				onClose={() => setShowApiKeyModal(false)}
			/>
		</Form>
	);
}
