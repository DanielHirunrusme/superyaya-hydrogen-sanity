import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteError,
  LiveReload,
} from '@remix-run/react';
import {
  Seo,
  type SeoHandleFunction,
  ShopifySalesChannel,
} from '@shopify/hydrogen';
import type { Collection, Shop } from '@shopify/hydrogen/storefront-api-types';
import {
  defer,
  type LinksFunction,
  type LoaderArgs,
} from '@shopify/remix-oxygen';
import { getPreview, PreviewProvider } from 'hydrogen-sanity';

import { GenericError } from '~/components/global/GenericError';
import { Layout } from '~/components/global/Layout';
import { NotFound } from '~/components/global/NotFound';
import { PreviewLoading } from '~/components/global/PreviewLoading';
import { useAnalytics } from '~/hooks/useAnalytics';
import { useNonce } from '~/lib/nonce';
import { DEFAULT_LOCALE } from '~/lib/utils';
import { LAYOUT_QUERY } from '~/queries/sanity/layout';
import { COLLECTION_QUERY_ID } from '~/queries/shopify/collection';
import stylesheet from '~/styles/tailwind.css';
import type { I18nLocale } from '~/types/shopify';
import IntroWrapper from './components/global/IntroWrapper';
import { ThemeProvider, useTheme } from './components/context/ThemeProvider';
import clsx from 'clsx';
import { Helmet, HelmetProvider } from "react-helmet-async";

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.layout?.seo?.title,
  titleTemplate: `%s${data?.layout?.seo?.title ? ` · ${data?.layout?.seo?.title}` : ''
    }`,
  description: data?.layout?.seo?.description,
});

export const handle = {
  seo,
};

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: stylesheet },
    {
      href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,500;0,700;1,500;1,700&display=swap',
      rel: 'stylesheet',
    },
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
      crossOrigin: 'anonymous',
    },
    // Favicon and App Icons - Using data URL as fallback
    { rel: 'icon', type: 'image/png', href: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAAEsAAAAAQAAASwAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAACCgAwAEAAAAAQAAACAAAAAA+eom7wAAAAlwSFlzAAAuIwAALiMBeKU/dgAABIZJREFUWAnFV2tPlEcUfpYuQbn57qIsrF2KwF4IF9dQASU00lRDCzaoSGOaAPZK+geq/WhRLlqxxqShjWliSGOT0iY1UinYxEINUEEKoh9glw9AI7bcDJdy2T2dGbuve3nXNuw2zJc9c86ZM885c+aZd1XEBjZwhGzg3mLrDQegDrQCTqcTy8vLT7IJCUFYWJhPyNXVVaytrSFEyc57IJDx4P4Dyt+7l17Ky6N9+fl0b3DQI9zM9AyVHHydcrJepLcqKomB8bAHfAQpxhSUHDqM4eFh3B8aQuuNGx4VaGm5js7ODiwsLqLieCXUaq+ie8AJYHK2vp7it8VSmsVCQ/eGRKTR0VGyZmSQKSmZbv9yWzE6FLXrULIzpsrycoqRJCorLSVe+sryCtJGb6EvL1/2GzFoAPgOdrudrOkZlKDfTvsLXiZ9rI7ePHbM59zd0aj4xOPQ/pmMjIzg154ejI+Nw+l0QKPRwGQ2IzIyEmb2GxUdrbQMTVeu4KMTJ4VNYmu++bZZrFN05kp3NFxeWVmhM9XVZNyRRDGsfIZ4vciIl1IXs1XIfb293svkOe/yVw8coG0aLVWfOiXr/QleLQl819yM8+c+QVJyMs7U1iJz5052f1UYGBjAV01N7D47YLZY/CbEu1ySJFY1J3S6OL9+LoMPgK6uLrHYarWitOyoyw8pRiMOHzmCxYUFhIeHy3pvweFwYG7uMdQqFaam/vQ2+8x9AJhMJqhYxu1tbShl99tsMbNMdIiP18OSmoqMzAyfIO6K2dlZ/D4xwY7WCduIzd2kKPs04QLL8GxdHa59fw2TDx9iaWkJTpbVc6y00azx9hUU4FzDeWi1WsWAnHZ7uruxyIhHr9cjLT1d0c+l9AHgMkxNTWHUbscEy2Z8bAz9d/vx861bmJ6exumaGrxX9b7LNbBf7+682dZOjE691WL+QVUVSZFRdPrjakX7epQePcAbiFEqfuvvx9E3ylBUXAxDQoJoykF2C3q6e7Bp8ybk7tkjZz0zM4PeO3fES6dWhyI7ezfz2SzbGSjBJ49ZY0ZERiAnN1f4ujvIwB2MTutrahl/Z9JWSUMxWyR6Pi6OtuviBKWaU1Lo4oULxIDKa+w2O2WmpQmO4G/BT+03ZRsX7DabeAs0UdF0nFEzp2z3odgDfzx6hH5WBZvNhrnZOYSGhsJgMGB3TjYSExNl8C6BERPeffsd1i/jKCk5hM8+bxTXkNtPfngCXzQ24rWiIly8dAmSRnIte/LrjiYQubOjQ2TKq/X11asi1A/XW8QLWfjKfvE4KcX3oWIlp/+q+7ShgWK1MZSdlUU/trZSXk4u7TAkEOsRvyGCCoBxhvj64a9gUsILoi/qa+v8bs4NQQXAA97t66NUo4k1bzwVFRbS/Pw8V/sdAX+SeXYUYN21C+mMrjmDFhUfREREhLeLxzzoAER0xS8Mj33lSdAB8MwnJyf50QoKl3fyIwQdwF8MAP8eMLJXlZGBn22fqhWJ6Kl5fRL/o8I/SELZC6pmJPas8b8AeNaG3ragH4H3Bv8233AAfwOPNNdG489rAgAAAABJRU5ErkJggg==' },
    // Apple Touch Icons
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    // Android Chrome Icons
    { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
    { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },
    // Web App Manifest
    { rel: 'manifest', href: '/site.webmanifest' },
  ];
};

export async function loader({ context }: LoaderArgs) {
  const { cart } = context;

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const preview = getPreview(context);

  const [shop, layout] = await Promise.all([
    context.storefront.query<{ shop: Shop }>(SHOP_QUERY),
    context.sanity.query<any>({ query: LAYOUT_QUERY, cache }),
  ]);

  const selectedLocale = context.storefront.i18n as I18nLocale;

  return defer({
    preview,
    analytics: {
      shopifySalesChannel: ShopifySalesChannel.hydrogen,
      shopId: shop.shop.id,
    },
    cart: cart.get(),
    layout,
    notFoundCollection: layout?.notFoundPage?.collectionGid
      ? context.storefront.query<{ collection: Collection }>(
        COLLECTION_QUERY_ID,
        {
          variables: {
            id: layout.notFoundPage.collectionGid,
            count: 16,
          },
        },
      )
      : undefined,
    sanityProjectID: context.env.SANITY_PROJECT_ID,
    sanityDataset: context.env.SANITY_DATASET,
    selectedLocale,
    storeDomain: context.storefront.getShopifyDomain(),
  });
}

function App() {
  const { preview, ...data } = useLoaderData<typeof loader>();
  const locale = data.selectedLocale ?? DEFAULT_LOCALE;
  const hasUserConsent = true;
  const nonce = useNonce();
  const { theme, navVisible } = useTheme();

  useAnalytics(hasUserConsent, locale);

  return (
    <html
      lang={locale.language}
      className={clsx(
        navVisible ? 'nav-visible' : 'nav-invisble',
        `theme-${theme}`,
      )}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        
        {/* Theme Color for mobile browsers */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Additional PWA meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Super Yaya" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        <Seo />
        <Meta />
        <Links />
        {/* Engravers */}
        <link
          rel="preload"
          href="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/EngraversEF-Roman_fd958985-d0ef-4793-805d-dd949c942b86.woff2?v=1708322770"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"

        />
        <link
          rel="preload"
          href="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/EngraversEF-Roman_96a32e28-3243-4330-8069-21e7f9c3b635.woff?v=1708322770"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        {/* Snell */}
        <link
          rel="preload"
          href="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/SnellRoundhandLTStd-Scr.woff2?v=1708322499"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/SnellRoundhandLTStd-Scr.woff?v=1708322499"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        {/* Engravers Gotchis */}
        <link
          rel="preload"
          href="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/EngraversGothicBT-Regular.woff2?v=1697635125"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/EngraversGothicBT-Regular.woff?v=1697635125"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        {/* Eurostile */}
        <link
          rel="preload"
          href="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/EurostileMonoEF-Regular.woff2?v=1697635125"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/EurostileMonoEF-Regular.woff?v=1697635125"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <script type="text/javascript">
          {`
            var _iub = _iub || [];
            _iub.csConfiguration = {
              "siteId": 3926637,
              "cookiePolicyId": 33461147,
              "lang": "en",
              "storage": {"useSiteId": true}
            };
          `}
        </script>
        <script type="text/javascript" src="https://cs.iubenda.com/autoblocking/3926637.js"></script>
        <script type="text/javascript" src="//cdn.iubenda.com/cs/gpp/stub.js"></script>
        <script type="text/javascript" src="//cdn.iubenda.com/cs/iubenda_cs.js" async></script>
      </head>
      <body>
        <PreviewProvider previewConfig={preview} fallback={<PreviewLoading />}>
          <IntroWrapper>
            <Layout key={`${locale.language}-${locale.country}`}>
              <Outlet />
            </Layout>
          </IntroWrapper>
        </PreviewProvider>

        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  const [root] = useMatches();
  const nonce = useNonce();

  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  const {
    selectedLocale: locale,
    layout,
    notFoundCollection,
  } = root.data
      ? root.data
      : { selectedLocale: DEFAULT_LOCALE, layout: null, notFoundCollection: {} };
  const { notFoundPage } = layout || {};

  let title = 'Error';
  if (isRouteError) {
    title = 'Not found';
  }

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title}</title>
        <Meta />
        <Links />
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/webmanifest" />
      </head>
      <body>
        <Layout
          key={`${locale.language}-${locale.country}`}
          backgroundColor={notFoundPage?.colorTheme?.background}
        >
          {isRouteError ? (
            <>
              {routeError.status === 404 ? (
                <NotFound
                  notFoundPage={notFoundPage}
                  notFoundCollection={notFoundCollection}
                />
              ) : (
                <GenericError
                  error={{ message: `${routeError.status} ${routeError.data}` }}
                />
              )}
            </>
          ) : (
            <GenericError error={error instanceof Error ? error : undefined} />
          )}
        </Layout>
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

const SHOP_QUERY = `#graphql
  query layout {
    shop {
      id
      name
      description
    }
  }
`;
