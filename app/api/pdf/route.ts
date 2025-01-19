import path from "node:path";
import * as fs from "node:fs/promises";
import pdf from "pdf-parse-fork";
import {} from "pdf-lib";
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
		const recomendations = await aiGenerateRecomendations(
			textExtracted,
			jobDescription,
		);

		if (recomendations) {
			return Response.json({
				status: "success",
				recomendations,
			});
		}
		return Response.json({
			status: "error",
			recomendations: "Failed to generate recomendations.",
		});
	} catch (error) {
		console.error("Error processing PDF:", error);
		return Response.json({
			status: "error",
			recomendations: "Failed to process PDF.",
		});
	}
}

async function extractTextFromPDF(pdfPath: string) {
	try {
		const dataBuffer = await fs.readFile(pdfPath);
		const pdfText = await pdf(dataBuffer);

		return pdfText.text;
	} catch (error) {
		console.error("Error processing PDF:", error);
		return "Failed to extract PDF content.";
	}
}

async function aiGenerateRecomendations(
	textExtracted: string,
	jobDescription: string,
): Promise<string[] | null> {
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
 ## INSTRUCCIONES ##
- Analiza el contenido del CV proporcionado y compáralo con la descripción del puesto de trabajo.
- Genera una lista clara, enumerada y específica de recomendaciones para mejorar el CV y hacerlo más relevante para el puesto de trabajo descrito.

## REQUISITOS ##
1. **No incluir** el texto completo del CV ni de la descripción del puesto en la respuesta.
2. Las recomendaciones deben estar basadas en las discrepancias entre las habilidades, experiencia y logros mencionados en el CV y los requisitos o habilidades deseadas en el puesto.
3. Identificar áreas de mejora específicas, como:
   - **Incorporación de palabras clave relevantes** mencionadas en la descripción del puesto que no están explícitas en el CV, pero son compatibles con las habilidades o experiencia del candidato.
   - **Mejoras en la redacción** de responsabilidades y logros para que sean más impactantes, utilizando métricas claras (e.g., "Aumenté el tráfico web en un 30%").
   - **Identificación de habilidades faltantes** que el candidato podría incluir en función de su experiencia previa, pero que no están destacadas actualmente.
   - **Propuestas para reorganizar** o priorizar secciones del CV según las necesidades del puesto.

## FORMATO DE RESPUESTA ##
- La respuesta debe ser **concisa, detallada y enumerada**.
- Ejemplos de formato de respuesta:
  1. Incluir palabras clave como "diseño responsivo" y "optimización móvil" en la sección de experiencia, ya que el CV menciona React y TailwindCSS en el desarrollo de interfaces web.
  2. Resaltar logros cuantificables, como "Reduje el tiempo de carga de páginas en un 25%", para alinearlo con el enfoque del puesto en rendimiento técnico.
  3. Reorganizar la sección de habilidades técnicas para que "JavaScript", "React", y "TailwindCSS" estén destacadas al inicio, dado que son prioritarias en la descripción del puesto.
  4. Corregir errores ortográficos y gramaticales detectados en la sección de educación.
  5. Incluir una sección de proyectos destacando un ejemplo donde se aplicaron habilidades relevantes, como desarrollo full stack con React y Node.js.

## NOTA IMPORTANTE ##
- Limita la respuesta únicamente a las recomendaciones enumeradas.
- Asegúrate de que las sugerencias sean relevantes para el contenido del CV y el puesto.
- No incluyas contenido literal del CV ni de la descripción del puesto en la respuesta.

## DESCRIPCION DEL PUESTO ##
${jobDescription}

## CV ORIGINAL ##
${textExtracted}
`;

		const { text } = await generateText({
			model,
			prompt,
		});

		console.log("AI Text:", text);

		const recomendationsArray = text
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => /^[0-9]+\.\s/.test(line)) // Asegura que sea una línea enumerada
			.map(
				(line) =>
					line
						.replace(/^[0-9]+\.\s/, "") // Quita el número y el punto inicial
						.replace(/\*\*/g, ""), // Elimina los asteriscos dobles
			);

		console.log("Recomendations Array:", recomendationsArray);

		return recomendationsArray;
	} catch (error) {
		console.error("Error generating CV:", error);
		return null;
	}
}
