import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";

// Algoritmo de cifrado
const algorithm = "aes-256-ctr";

// Obtener la clave secreta de 32 bytes desde las variables de entorno (decodificada desde base64)
const secretKey = Buffer.alloc(
	32,
	process.env.ENCRYPTION_KEY || "defaultSecretKey32CharactersLong!",
	"base64",
);

// Verificar la longitud de la clave
if (secretKey.length !== 32) {
	throw new Error("La clave de cifrado debe tener exactamente 32 bytes");
}

export async function encryptApiKey(apiKey: string): Promise<string> {
	const iv = randomBytes(16); // Generar un IV aleatorio
	const cipher = createCipheriv(algorithm, secretKey, iv);
	const encrypted = Buffer.concat([cipher.update(apiKey), cipher.final()]);
	return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export async function decryptApiKey(encryptedApiKey: string): Promise<string> {
	const [ivHex, contentHex] = encryptedApiKey.split(":");
	const iv = Buffer.from(ivHex, "hex");
	const content = Buffer.from(contentHex, "hex");
	const decipher = createDecipheriv(algorithm, secretKey, iv);
	const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
	return decrypted.toString();
}
