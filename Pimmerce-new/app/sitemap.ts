import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.pimmerce.com', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://www.pimmerce.com/contact', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
  ]
}
