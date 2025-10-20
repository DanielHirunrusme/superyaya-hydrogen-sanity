import { type LoaderArgs } from '@shopify/remix-oxygen';

export async function loader({ request }: LoaderArgs) {
  const manifest = {
    "name": "Super Yaya",
    "short_name": "Super Yaya",
    "description": "Super Yaya - Premium Fashion Brand",
    "icons": [
      {
        "src": "/android-chrome-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ],
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone",
    "start_url": "/"
  };
  
  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}
