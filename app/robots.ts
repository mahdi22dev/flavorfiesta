import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/admin/"],
      },
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://cutandsear.com/sitemap.xml",
  };
}
