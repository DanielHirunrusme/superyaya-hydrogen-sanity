/**
 * Utility functions for social sharing and Open Graph meta tags
 */

export interface SocialSharingImage {
  url: string;
  width: number;
  height: number;
  altText: string;
}

export interface SocialSharingData {
  title: string;
  description: string;
  image?: SocialSharingImage;
  url?: string;
  siteName?: string;
  type?: string;
}

/**
 * Get the default social sharing image
 */
export function getDefaultSocialImage(siteUrl: string): SocialSharingImage {
  return {
    url: `${siteUrl}/images/syy-og.jpg`,
    width: 1200,
    height: 630,
    altText: 'Super Yaya - Fashion and Lifestyle',
  };
}

/**
 * Generate social sharing URLs
 */
export function generateSocialSharingUrls(data: SocialSharingData): {
  facebook: string;
  twitter: string;
  linkedin: string;
  pinterest: string;
} {
  const encodedUrl = encodeURIComponent(data.url || '');
  const encodedTitle = encodeURIComponent(data.title);
  const encodedDescription = encodeURIComponent(data.description);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedDescription}`,
  };
}

/**
 * Get Open Graph meta tags for social sharing
 */
export function getOpenGraphMetaTags(data: SocialSharingData): Array<{ property: string; content: string }> {
  const tags: Array<{ property: string; content: string }> = [
    { property: 'og:title', content: data.title },
    { property: 'og:description', content: data.description },
    { property: 'og:type', content: data.type || 'website' },
    { property: 'og:site_name', content: data.siteName || 'Super Yaya' },
  ];

  if (data.url) {
    tags.push({ property: 'og:url', content: data.url });
  }

  if (data.image) {
    tags.push(
      { property: 'og:image', content: data.image.url },
      { property: 'og:image:width', content: data.image.width.toString() },
      { property: 'og:image:height', content: data.image.height.toString() },
      { property: 'og:image:alt', content: data.image.altText },
    );
  }

  return tags;
}

/**
 * Get Twitter Card meta tags
 */
export function getTwitterCardMetaTags(data: SocialSharingData): Array<{ name: string; content: string }> {
  const tags: Array<{ name: string; content: string }> = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: data.title },
    { name: 'twitter:description', content: data.description },
  ];

  if (data.image) {
    tags.push({ name: 'twitter:image', content: data.image.url });
    tags.push({ name: 'twitter:image:alt', content: data.image.altText });
  }

  return tags;
}
