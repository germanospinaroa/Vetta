import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap { const siteUrl = process.env.VETTA_ENV === "production" ? "https://vetta-beryl.vercel.app" : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"); return [{ url: siteUrl, lastModified: new Date() }]; }
