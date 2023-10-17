import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {SanityPreview} from 'hydrogen-sanity';
import {Suspense} from 'react';
import season from 'studio/schemas/documents/season';
import {Link} from '~/components/Link';
import StaggerIndexList from '~/components/framer/StaggerIndexList';

import HomeHero from '~/components/heroes/Home';
import ModuleGrid from '~/components/modules/ModuleGrid';
import ModuleSlideshow from '~/components/modules/ModuleSlideshow';
import type {SanityHomePage} from '~/lib/sanity';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {SEASON_INDEX_PAGE} from '~/queries/sanity/seasons';

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
    query: SEASON_INDEX_PAGE,
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
      pageType: AnalyticsPageType.page,
    },
  });
}

export default function Index() {
  const {page, gids} = useLoaderData<typeof loader>();
  return (
    <SanityPreview data={page} query={SEASON_INDEX_PAGE}>
      {(page) => (
        <Suspense>
          <Await resolve={gids}>
            <StaggerIndexList className="left-0  top-0 flex h-full w-full flex-col items-center justify-center text-center">
              <ul className="pb-20 flex flex-col items-center justify-center text-center">
                {page?.map((season) => (
                  <li className='opacity-0' key={season.slug}>
                  <Link
                    to={season.slug}
                    title={season.title}
                    
                    className="font-cursive large-title text-2xl self-start mx-auto !normal-case md:text-3xl lg:text-4xl 2xl:text-5xl"
                  >
                    {season.title}
                  </Link>
                  </li>
                ))}
              </ul>
            </StaggerIndexList>
          </Await>
        </Suspense>
      )}
    </SanityPreview>
  );
}
