/**
 * Utility functions for generating canonical URLs
 */

const PRODUCTION_URL = 'https://super-yaya.com';

/**
 * Generates a canonical URL for the current page
 * @param request - The request object from Remix
 * @param pathname - Optional pathname override (useful for localized routes)
 * @returns The canonical URL
 */
export function getCanonicalUrl(request: Request, pathname?: string): string {
  const url = new URL(request.url);
  
  // Use provided pathname or extract from request URL
  const canonicalPath = pathname || url.pathname;
  
  // Remove language prefix if present (e.g., /en/ -> /)
  const cleanPath = canonicalPath.replace(/^\/[a-z]{2}\//, '/');
  
  // Ensure path starts with /
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  
  return `${PRODUCTION_URL}${normalizedPath}`;
}

/**
 * Generates a canonical URL for a specific route
 * @param route - The route path (e.g., '/products/my-product')
 * @returns The canonical URL
 */
export function getCanonicalUrlForRoute(route: string): string {
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;
  return `${PRODUCTION_URL}${cleanRoute}`;
}

/**
 * Generates a canonical URL for a product
 * @param handle - The product handle
 * @param locale - Optional locale (will be stripped from canonical URL)
 * @returns The canonical URL
 */
export function getProductCanonicalUrl(handle: string, locale?: string): string {
  return getCanonicalUrlForRoute(`/products/${handle}`);
}

/**
 * Generates a canonical URL for a collection
 * @param handle - The collection handle
 * @param locale - Optional locale (will be stripped from canonical URL)
 * @returns The canonical URL
 */
export function getCollectionCanonicalUrl(handle: string, locale?: string): string {
  return getCanonicalUrlForRoute(`/collections/${handle}`);
}

/**
 * Generates a canonical URL for a page
 * @param handle - The page handle
 * @param locale - Optional locale (will be stripped from canonical URL)
 * @returns The canonical URL
 */
export function getPageCanonicalUrl(handle: string, locale?: string): string {
  return getCanonicalUrlForRoute(`/pages/${handle}`);
}

