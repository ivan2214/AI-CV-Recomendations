"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
	// custom settings
	apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const aiGenerateCV = async (
	cvFile: File,
	jobDescription: string,
): Promise<{
	status: "success" | "error";
	data: string;
}> => {
	// TODO: CREATE PROMPT AND CALL GENERATE IA MODEL
	try {
		const model = google("gemini-1.5-pro-latest");
		const prompt = `
    Generate a resume based on the job description and the CV file.
    Job description: ${JSON.stringify(jobDescription)}
    CV file: ${JSON.stringify(cvFile)}
    `;
		const { text } = await generateText({
			model,
			prompt,
		});

		console.log("Respuesta IA", text);

		return {
			status: "success",
			data: text,
		};
	} catch (error) {
		console.log(error);
		return {
			status: "error",
			data: `Error generating CV ${JSON.stringify(error)}`,
		};
	}
};
