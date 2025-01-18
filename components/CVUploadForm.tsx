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
			jobDescription: `
Requisitos 

Experiencia: 
Mínimo de 3 años como desarrollador front-end. Tecnologías: Dominio de HTML5, CSS3, JavaScript, TypeScript, Node.js y Vainilla JS.
Frameworks:
Experiencia con jQuery, React, Bootstrap 3+.
Familiarizado con herramientas como Babel y Webpack.
Sólida experiencia en el uso de Gatsby.js
Diseño responsivo: Conocimiento profundo de la creación de diseños responsivos, aplicaciones web progresivas (PWA) y aplicaciones de una sola página (SPA).
Control de versiones: Competente en el uso de Git para el control de versiones de código fuente.
Pruebas: Experiencia con marcos de pruebas unitarias y de integración como Mocha y Jest.
Optimización web: Fundamentos sólidos en la optimización de páginas web, que incluyen:
Análisis de tiempos de carga.
Implementación de estrategias de almacenamiento en caché.
Optimización de la entrega de imágenes y contenido a través de CDN.
Técnicas como la carga diferida y la construcción de componentes web.
Calidad del código: Competente en el uso de herramientas de revisión de código como SonarQube y Linting.
Fundamentos de DevOps: Comprensión básica de los flujos de trabajo de integración.
Marcos Ágiles: Conocimiento de metodologías ágiles de desarrollo y buenas prácticas.`,
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
			const formData = new FormData();
			formData.append("cvOriginal", cvOriginal, cvOriginal.name);
			formData.append("jobDescription", jobDescription);

			startTransition(async () => {
				const response = await fetch("/api/pdf", {
					method: "POST",
					body: formData,
				});
				const result = await response.blob();
				const pdfUrl = URL.createObjectURL(result);

				console.log("Result:", result);

				if (pdfUrl) {
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
