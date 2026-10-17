import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots { const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VETTA_ENV === "production" ? "https://vetta-beryl.vercel.app" : "http://localhost:3000"); return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/matriz", "/privacidad", "/terminos"] }, sitemap: `${siteUrl}/sitemap.xml` }; }
