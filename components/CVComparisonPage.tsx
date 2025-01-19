"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FileText, Upload, Zap } from "lucide-react";
import { useState, useTransition } from "react";
import CVUploadForm from "./CVUploadForm";
import { Progress } from "./ui/progress";
import SuggestionsList from "./SuggestionsList";

export default function CVComparisonPage() {
	const [file, setFile] = useState<File | null>();
	const [recommendations, setRecommendations] = useState<string[]>([]);
	const [isPending, startTransition] = useTransition();

	const handleUpload = (file: File) => {
		setFile(file);
	};

	const handleRecomendations = (recomendations: string[]) => {
		setRecommendations(recomendations);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-700 via-blue-800 to-teal-500 px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl">
				<h2 className="mb-8 animate-pulse text-center font-bold text-5xl text-white">
					AI CV Recomendations
				</h2>
				<div className="grid gap-8 md:grid-cols-2">
					<Card className="border-0 bg-white/10 shadow-xl backdrop-blur-lg">
						<CardHeader>
							<CardTitle className="flex items-center text-2xl text-white">
								<Upload className="mr-2" /> Upload CV & Job Description
							</CardTitle>
							<CardDescription className="text-gray-200">
								Get AI-powered recommendations
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CVUploadForm
								isPending={isPending}
								onUpload={handleUpload}
								handleRecomendations={handleRecomendations}
								startTransition={startTransition}
							/>
						</CardContent>
					</Card>

					<div className="space-y-8">
						<Card className="border-0 bg-white/10 shadow-xl backdrop-blur-lg">
							<CardHeader>
								<CardTitle className="flex items-center text-2xl text-white">
									<FileText className="mr-2" /> Uploaded CV
								</CardTitle>
							</CardHeader>
							<CardContent>
								{file ? (
									<div className="rounded-md bg-white/20 p-4">
										<p className="text-white">{file.name}</p>
										<p className="text-gray-300 text-sm">
											Size: {(file.size / 1024).toFixed(2)} KB
										</p>
									</div>
								) : (
									<p className="text-gray-300 italic">No CV uploaded yet.</p>
								)}
							</CardContent>
						</Card>

						<Card className="border-0 bg-white/10 shadow-xl backdrop-blur-lg">
							<CardHeader>
								<CardTitle className="flex items-center text-2xl text-white">
									<Zap className="mr-2" /> AI Recommendations
								</CardTitle>
							</CardHeader>
							<CardContent>
								{isPending ? (
									<div className="space-y-4">
										<p className="text-white">
											Analyzing your CV and job description...
										</p>
										<Progress value={33} className="w-full bg-secondary" />
									</div>
								) : recommendations.length > 0 ? (
									<SuggestionsList recommendations={recommendations} />
								) : (
									<p className="text-gray-300 italic">
										AI-powered recommendations will appear here after
										processing.
									</p>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
