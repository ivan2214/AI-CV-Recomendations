import path from "node:path";
import * as fs from "node:fs/promises";
import pdf from "pdf-parse-fork";
import { PDFDocument, type PDFFont, rgb, StandardFonts } from "pdf-lib";
/* import { createGoogleGenerativeAI } from "@ai-sdk/google"; */
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
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

		const pdfBlob = await generateStyledPDF(filePath, newTextFromAi);
		await fs.unlink(filePath); // Eliminar el archivo después de procesarlo

		// Enviar el Blob directamente al front-end
		return new Response(pdfBlob, {
			headers: {
				"Content-Type": "application/pdf",
			},
		});
	} catch (error) {
		console.error("Error processing PDF:", error);
		return Response.json({
			status: "error",
			data: "Failed to process PDF.",
			pdfBlob: null,
		});
	}
}

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

// Nueva función para dividir el texto en líneas ajustadas al ancho de la página
function splitTextIntoLines(
	text: string,
	font: PDFFont,
	fontSize: number,
	maxWidth: number,
): string[] {
	const words = text.replace(/\n/g, " ").split(" "); // Reemplaza saltos de línea por espacio
	const lines: string[] = [];
	let currentLine = "";

	for (const word of words) {
		const testLine = currentLine ? `${currentLine} ${word}` : word;
		const width = font.widthOfTextAtSize(testLine, fontSize);

		if (width <= maxWidth) {
			currentLine = testLine;
		} else {
			if (currentLine) {
				lines.push(currentLine);
			}
			currentLine = word; // Empieza una nueva línea
		}
	}

	if (currentLine) {
		lines.push(currentLine); // Agrega la última línea si queda texto
	}

	return lines;
}

async function generateStyledPDF(
	originalPdfPath: string,
	newText: string,
): Promise<Blob> {
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

		const lines = splitTextIntoLines(newText, helveticaFont, 12, width - 100);
		let yPosition = height - 100;
		const lineHeight = 12 * 1.2; // Ajuste del espaciado de las líneas

		for (const line of lines) {
			firstPage.drawText(line, {
				x: 50,
				y: yPosition,
				size: 12,
				font: helveticaFont,
				color: rgb(0, 0, 0),
			});
			yPosition -= lineHeight; // Usar lineHeight para el espaciado
		}
		const newPdfBytes = await newPdfDoc.save();
		const blob = new Blob([newPdfBytes], { type: "application/pdf" });

		return blob;
	} catch (error) {
		console.error("Error generating styled PDF:", error);
		throw new Error("Failed to generate styled PDF.");
	}
}

async function aiGenerateCV(
	textExtracted: string,
	jobDescription: string,
): Promise<string | null> {
	/* 	const google = createGoogleGenerativeAI({
		apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
	}); */

	const lmstudio = createOpenAICompatible({
		name: "lmstudio",
		baseURL: "http://localhost:1234/v1",
	});

	try {
		if (!textExtracted) throw new Error("No CV file provided");
		if (!jobDescription) throw new Error("No job description provided");

		/* const model = google("gemini-1.5-pro-latest"); */

		const model = lmstudio("llama-3.2-1b");

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

		// Limpiar y formatear el texto antes de devolverlo
		const cleanedText = text
			.replace(/\n+/g, "\n") // Reemplaza saltos de línea excesivos por un solo salto de línea
			.replace(/ +/g, " ") // Reemplaza espacios múltiples por un solo espacio
			.trim(); // Elimina espacios al inicio y final del texto

		console.log("Cleaned Text:", cleanedText);

		return cleanedText;
	} catch (error) {
		console.error("Error generating CV:", error);
		return null;
	}
}
