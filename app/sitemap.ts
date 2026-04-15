import type { MetadataRoute } from "next";
import { getDynamicSitemapEntries } from "@/actions/actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const maps: MetadataRoute.Sitemap = [
    {
      url: "https://cutandsear.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://cutandsear.com/recipes",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: "https://cutandsear.com/guides",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const dynamicEntries = await getDynamicSitemapEntries();
  console.log("length of sitemap: ", dynamicEntries.length);

  return [...maps, ...dynamicEntries];
}
