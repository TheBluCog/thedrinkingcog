import type { MetadataRoute } from 'next';

const baseUrl = 'https://thedrinkingcog-git-main-theblucogs-projects.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1
    }
  ];
}
