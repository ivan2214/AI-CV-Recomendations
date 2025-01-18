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

type CVUploadFormProps = {
	onUpload: (oldCV: string, newCV: string, suggestions: string[]) => void;
};

const formSchema = z.object({
	cvFile: z.instanceof(File).refine((file) => file.size > 0, {
		message: "CV file is required and must not be empty",
	}),
	jobDescription: z.string().min(10).max(160),
});

export default function CVUploadForm({ onUpload }: CVUploadFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			cvFile: undefined,
			jobDescription: "",
		},
	});

	const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const fileURL = URL.createObjectURL(file);
			onUpload(fileURL, fileURL, [
				"Mejorar habilidades técnicas",
				"Añadir más proyectos",
				"Destacar logros",
			]);
		}
	};

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="cvFile"
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
								Seleccione un archivo PDF, DOC, DOCX o TXT.
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

				<Button type="submit">Analizar</Button>
			</form>
		</Form>
	);
}
