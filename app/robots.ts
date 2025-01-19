import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/api/", "/api/pdf/"],
		},
		sitemap: "https://ai-cv-recomendations.vercel.app/sitemap.xml",
	};
}
