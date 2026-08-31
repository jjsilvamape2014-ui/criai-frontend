const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://criai-frontend-production.up.railway.app';

export default function sitemap() {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/plans`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/dashboard`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
  ];
}
