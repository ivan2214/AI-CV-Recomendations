"use server";

import { encryptApiKey } from "@/lib/encryption";
import { cookies } from "next/headers";

export async function saveApiKey(apiKey: string) {
	const encryptedKey = await encryptApiKey(apiKey);
	(await cookies()).set("api_key", encryptedKey, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	});
}

export async function getApiKey() {
	const apiKey = (await cookies()).get("api_key");
	return apiKey?.value;
}
