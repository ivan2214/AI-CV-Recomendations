import path from "node:path";
import * as fs from "node:fs/promises";
import pdf from "pdf-parse-fork";

export async function POST(req: Request) {
	const formData = await req.formData();
	const cvOriginal = formData.get("cvOriginal") as File;

	if (!cvOriginal) {
		return new Response(JSON.stringify({ error: "No file uploaded" }), {
			status: 400,
		});
	}

	const filePath = path.join(process.cwd(), "public", cvOriginal.name);
	const buffer = Buffer.from(await cvOriginal.arrayBuffer());

	try {
		await fs.writeFile(filePath, buffer);
		const text = await extractTextFromPDF(filePath);
		await fs.unlink(filePath); // Eliminar el archivo después de procesarlo
		return new Response(JSON.stringify({ text }), {
			status: 200,
		});
	} catch (error) {
		console.error("Error processing PDF:", error);
		return new Response(
			JSON.stringify({ error: "Failed to extract PDF content." }),
			{
				status: 500,
			},
		);
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
