"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Badge } from "./ui/badge";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	cvFile: z.instanceof(File).refine((file) => file.size > 0, {
		message: "CV file is required and must not be empty",
	}),
	jobDescription: z
		.string()
		.min(10, {
			message: "Bio must be at least 10 characters.",
		})
		.max(160, {
			message: "Bio must not be longer than 30 characters.",
		}),
});

export default function CVComparison() {
	const [oldCV, setOldCV] = useState<string>("");
	const [newCV, setNewCV] = useState<string>("");
	const [jobDescription, setJobDescription] = useState<string>("");
	const [suggestions, setSuggestions] = useState<string[]>([]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			cvFile: undefined,
			jobDescription: "",
		},
	});

	/* 	const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setOldCV(e.target?.result as string);
				// Aquí simularíamos la generación del nuevo CV
				setNewCV(`Nuevo CV generado basado en: ${e.target?.result}`);
				// Simular sugerencias
				setSuggestions([
					"Mejorar habilidades técnicas",
					"Añadir más proyectos",
					"Destacar logros",
				]);
			};
			reader.readAsText(file);
		}
	}; */

	const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const fileURL = URL.createObjectURL(file);
			setOldCV(fileURL);

			// Simular la generación del nuevo CV como PDF
			setNewCV(fileURL);

			// Simular sugerencias
			setSuggestions([
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
		<div className="flex flex-col gap-4 md:flex-row">
			<div className="w-full space-y-4 md:w-1/3">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<Card className="p-4">
							<CardHeader>
								<CardTitle className="text-xl">
									Cargar CV y Descripción de Oferta
								</CardTitle>
							</CardHeader>
							<CardContent>
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
														const files = e.target.files;
														const file = files?.[0];
														field.onChange(file);
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
													placeholder="Descripción de la oferta laboral"
													className="resize-none"
													{...field}
													onChange={(e) => {
														const value = e.target.value;
														field.onChange(value);
														setJobDescription(value);
													}}
												/>
											</FormControl>
											<FormDescription>
												Ingrese la descripción de la oferta laboral
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
						<Button type="submit">Analizar</Button>
					</form>
				</Form>
			</div>
			<div className="w-full space-y-4 md:w-2/3">
				<Card>
					<CardHeader>
						<CardTitle className="text-xl">Comparación de CV</CardTitle>
					</CardHeader>
					<CardContent>
						<div>
							<Badge className="mb-4 font-medium">CV Original</Badge>
							{oldCV && (
								<iframe
									src={oldCV}
									className="h-72 w-full"
									title="CV Original"
								/>
							)}
						</div>
						{/* linea separadora */}
						<div className="my-4 h-px w-full bg-gray-400" />
						<div>
							<Badge className="my-4 font-medium">CV Generado</Badge>
							{newCV && (
								<iframe
									src={newCV}
									className="h-72 w-full"
									title="CV Generado"
								/>
							)}
						</div>
					</CardContent>
				</Card>
				<Card className="p-4">
					<CardHeader>
						<CardTitle className="text-xl">
							Sugerencias y Recomendaciones
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul>
							{suggestions.map((suggestion) => (
								<li className="mb-2 list-disc" key={suggestion}>
									{suggestion}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
