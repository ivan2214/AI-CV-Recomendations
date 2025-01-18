import path from "node:path";
import * as fs from "node:fs/promises";
import pdf from "pdf-parse-fork";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
	const formData = await req.formData();
	const cvOriginal = formData.get("cvOriginal") as File;
	const jobDescription = formData.get("jobDescription") as string;

	if (!cvOriginal) {
		return new Response(JSON.stringify({ error: "No file uploaded" }), {
			status: 400,
		});
	}

	const filePath = path.join(process.cwd(), "public", cvOriginal.name);
	const buffer = Buffer.from(await cvOriginal.arrayBuffer());

	try {
		await fs.writeFile(filePath, buffer);
		const textExtracted = await extractTextFromPDF(filePath);
		const newTextFromAi = await aiGenerateCV(textExtracted, jobDescription);

		if (!newTextFromAi) {
			return new Response(
				JSON.stringify({ error: "Failed to generate AI text." }),
				{
					status: 500,
				},
			);
		}

		const pdfUrl = await generateStyledPDF(filePath, newTextFromAi);
		await fs.unlink(filePath); // Eliminar el archivo después de procesarlo

		return Response.json({
			status: "success",
			data: newTextFromAi,
			pdfUrl: pdfUrl,
		});
	} catch (error) {
		console.error("Error processing PDF:", error);
		return Response.json({
			status: "error",
			data: "Failed to process PDF.",
			pdfUrl: null,
		});
	}
}

// Try using pdf-parse, fallback to a different library if there's an error
async function extractTextFromPDF(pdfPath: string) {
	try {
		const dataBuffer = await fs.readFile(pdfPath);
		const pdfText = await pdf(dataBuffer);

		console.log("PDF Text:", pdfText.text);

		return pdfText.text;
	} catch (error) {
		console.error("Error processing PDF:", error);
		return "Failed to extract PDF content.";
	}
}

async function generateStyledPDF(originalPdfPath: string, newText: string) {
	try {
		const existingPdfBytes = await fs.readFile(originalPdfPath);
		const originalPdfDoc = await PDFDocument.load(existingPdfBytes);
		const newPdfDoc = await PDFDocument.create();

		const copiedPages = await newPdfDoc.copyPages(
			originalPdfDoc,
			originalPdfDoc.getPageIndices(),
		);

		for (const page of copiedPages) {
			newPdfDoc.addPage(page);
		}

		const helveticaFont = await newPdfDoc.embedFont(StandardFonts.Helvetica);
		const firstPage = newPdfDoc.getPages()[0];
		const { width, height } = firstPage.getSize();

		firstPage.drawText(newText, {
			x: 50,
			y: height - 100,
			size: 12,
			font: helveticaFont,
			color: rgb(0, 0, 0),
			maxWidth: width - 100,
			lineHeight: 14,
		});

		const newPdfBytes = await newPdfDoc.save();

		const newFilePath = path.join(
			process.cwd(),
			"public",
			`modified_${path.basename(originalPdfPath)}`,
		);
		await fs.writeFile(newFilePath, newPdfBytes);

		const modifiedPdfPath = path.join(
			process.cwd(),
			"public",
			`modified_${path.basename(originalPdfPath)}`,
		);

		const blobModifiedPdf = await fs.readFile(modifiedPdfPath);
		const blob = new Blob([blobModifiedPdf], { type: "application/pdf" });

		const pdfUrl = URL.createObjectURL(blob);

		console.log({
			pdfUrl,
		});

		return pdfUrl;
	} catch (error) {
		console.error("Error generating styled PDF:", error);
		throw new Error("Failed to generate styled PDF.");
	}
}

export const aiGenerateCV = async (
	textExtracted: string,
	jobDescription: string,
): Promise<string | null> => {
	const google = createGoogleGenerativeAI({
		apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
	});
	try {
		// validacion
		if (!textExtracted) {
			throw new Error("No CV file provided");
		}

		if (!jobDescription) {
			throw new Error("No job description provided");
		}

		// Generate AI text
		const model = google("gemini-1.5-pro-latest");
		const prompt = `
# INSTRUCCIONES IMPORTANTES #
- Mantén toda la información relevante del CV original.
- Escribe en el mismo idioma en que se encuentra el CV original.
- Conserva exactamente el estilo, formato, fuente y diseño del CV original.
- Corrige errores ortográficos y gramaticales.
- Mejora el contenido utilizando palabras clave de la descripción del puesto.

### OBJETIVO ###
Generar una versión optimizada del CV original adaptada a la siguiente descripción de puesto, destacando habilidades y experiencia relevantes.

Descripción del puesto: ${jobDescription}
CV original: ${textExtracted}
`;

		const { text } = await generateText({ model, prompt });

		console.log({
			text,
		});

		return text;
	} catch (error) {
		console.error("Error generating CV:", error);
		return null;
	}
};
