import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	icons: {
		apple: "/apple-touch-icon.png",
		shortcut: "/favicon-32x32.png",
		other: {
			rel: "manifest",
			url: "/site.webmanifest",
		},
		icon: "/favicon.ico",
	},
	title: {
		default: "AI CV Recommendations",
		template: "%s | AI CV Recommendations",
	},
	description:
		"AI CV Recommendations es una herramienta gratuita que utiliza Google Gemini AI para generar 10 recomendaciones personalizadas para mejorar tu CV según una oferta de trabajo.",
	keywords: [
		"AI CV recommendations",
		"optimizar CV",
		"recomendaciones para empleo",
		"mejorar CV",
		"inteligencia artificial",
		"Google Gemini AI",
	],
	authors: [
		{
			name: "Ivan Agustin Bongiovanni",
			url: "https://www.linkedin.com/in/bongiovanni-ivan45",
		},
	],
	openGraph: {
		title: "AI CV Recommendations",
		description:
			"Recibe 10 recomendaciones personalizadas para mejorar tu CV en base a una oferta de empleo.",
		type: "website",
		url: "https://ai-cv-recomendations.vercel.app",
		siteName: "AI CV Recommendations",
		images: [
			{
				url: "https://ai-cv-recomendations.vercel.app/imagen-portada.jpg",
				width: 1200,
				height: 630,
				alt: "AI CV Recommendations - Mejorando tu CV con IA",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "AI CV Recommendations",
		description:
			"AI CV Recommendations es una herramienta gratuita para optimizar tu CV según la descripción de un empleo utilizando Google Gemini AI.",
		images: {
			url: "https://ai-cv-recomendations.vercel.app/imagen-portada.jpg",
			width: 1200,
			height: 630,
			alt: "AI CV Recommendations - Mejorando tu CV con IA",
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<body
				className={`${geistSans.variable} ${geistMono.variable} bg-gray-900 text-white antialiased`}
			>
				<Header />
				<main>{children}</main>
				<Toaster />
				<Analytics />
			</body>
		</html>
	);
}
