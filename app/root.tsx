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
