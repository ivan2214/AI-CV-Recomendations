"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { aiGenerateCV } from "@/actions/ai/iaGenerateCV";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

type CVUploadFormProps = {
	onUpload: (oldCV: string) => void;
	handleNewCVUpload: (newCV: string) => void;
};

const formSchema = z.object({
	cvOriginal: z.instanceof(File).refine((file) => file.size > 0, {
		message: "CV file is required and must not be empty",
	}),
	jobDescription: z.string().min(10).max(1500),
});

export default function CVUploadForm({
	onUpload,
	handleNewCVUpload,
}: CVUploadFormProps) {
	const [isPending, startTransition] = useTransition();
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
			const fileURL = URL.createObjectURL(file);
			onUpload(fileURL);
		}
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { cvOriginal, jobDescription } = values;
		try {
			startTransition(async () => {
				const { status, pdfUrl, data } = await aiGenerateCV(
					cvOriginal,
					jobDescription,
				);
				if (status === "success" && pdfUrl) {
					console.log({
						data,
					});

					handleNewCVUpload(pdfUrl);
				} else {
					console.log("Error al generar el PDF");
				}
			});
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4"
				encType="multipart/form-data"
			>
				<FormField
					control={form.control}
					name="cvOriginal"
					render={({ field }) => (
						<FormItem>
							<FormLabel>CV</FormLabel>
							<FormControl>
								<Input
									type="file"
									accept=".txt,.pdf,.doc,.docx"
									onChange={(e) => {
										field.onChange(e.target.files?.[0]);
										handleCVUpload(e);
									}}
								/>
							</FormControl>
							<FormDescription>
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
							<FormLabel>Job Description</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder="Descripción de la oferta laboral"
								/>
							</FormControl>
							<FormDescription>
								Ingrese la descripción de la oferta laboral
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button disabled={isPending} type="submit">
					{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{isPending ? "Analizando" : "Analizar"}
				</Button>
			</form>
		</Form>
	);
}
