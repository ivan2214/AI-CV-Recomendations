"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const google = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const aiGenerateCV = async (
	originalCV: File,
	jobDescription: string,
): Promise<{
	status: "success" | "error";
	data: string;
	pdfUrl?: string;
}> => {
	try {
		// Validate inputs
		if (!originalCV) {
			throw new Error("No CV file provided");
		}

		if (!jobDescription) {
			throw new Error("No job description provided");
		}

		// Generate AI text
		const model = google("gemini-1.5-pro-latest");
		const prompt = `
    Generar un currículum basado en la descripción del puesto y el archivo CV.
	Respetar completamente el estilo y formato del CV original.
	Responder con texto en el idioma que se encuentra en el CV original.
    Descripción: ${jobDescription}
    `;

		const { text } = await generateText({ model, prompt });

		console.log("cvOriginal", originalCV);

		console.log({
			text,
		});

		// Convert File to ArrayBuffer
		const originalPdfBytes = await originalCV.arrayBuffer();

		// Load original PDF
		const originalPdfDoc = await PDFDocument.load(originalPdfBytes);

		// Create a new PDF document
		const newPdfDoc = await PDFDocument.create();

		// Copy pages from the original PDF
		const copiedPages = await newPdfDoc.copyPages(
			originalPdfDoc,
			originalPdfDoc.getPageIndices(),
		);
		for (const page of copiedPages) {
			newPdfDoc.addPage(page);
		}

		// Embed a standard font
		const helveticaFont = await newPdfDoc.embedFont(StandardFonts.Helvetica);

		// Modify the first page (you may need to adjust positioning)
		const firstPage = newPdfDoc.getPages()[0];
		const { width, height } = firstPage.getSize();

		// Clear existing text and add new text (simplified approach)
		firstPage.drawText(text, {
			x: 50,
			y: height - 100,
			size: 12,
			font: helveticaFont,
			color: rgb(0, 0, 0),
			maxWidth: width - 100, // Constrain text width
			lineHeight: 14,
		});

		// Save the PDF
		const pdfBytes = await newPdfDoc.save();

		// Convert to Blob for frontend
		const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
		const pdfUrl = URL.createObjectURL(pdfBlob);

		// In a server action, you might want to save this to a file or storage
		// For now, we'll return the text and indicate success
		return {
			status: "success",
			data: text,
			pdfUrl: pdfUrl,
		};
	} catch (error) {
		console.error("Error generating CV:", error);
		return {
			status: "error",
			data: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
