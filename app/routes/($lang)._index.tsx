import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {SanityPreview} from 'hydrogen-sanity';
import {Suspense} from 'react';

import HomeHero from '~/components/heroes/Home';
import ModuleGrid from '~/components/modules/ModuleGrid';
import ModuleSlideshow from '~/components/modules/ModuleSlideshow';
import type {SanityHomePage} from '~/lib/sanity';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {HOME_PAGE_QUERY} from '~/queries/sanity/home';

const seo: SeoHandleFunction = ({data}) => ({
  title: data?.page?.seo?.title || 'Sanity x Hydrogen',
  description:
    data?.page?.seo?.description ||
    'A custom storefront powered by Hydrogen and Sanity',
});

export const handle = {
  seo,
};

export async function loader({context, params}: LoaderArgs) {
  validateLocale({context, params});

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const page = await context.sanity.query<SanityHomePage>({
    query: HOME_PAGE_QUERY,
    cache,
  });

  if (!page) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({page, context});

  return defer({
    page,
    gids,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Index() {
  const {page, gids} = useLoaderData<typeof loader>();

  return (
    <SanityPreview data={page} query={HOME_PAGE_QUERY}>
      {(page) => (
        <Suspense>
          <Await resolve={gids}>


            {page?.modules && (
              <ModuleSlideshow modules={page.modules} detached={false} showCount={false} />
            )}
          </Await>
        </Suspense>
      )}
    </SanityPreview>
  );
}
