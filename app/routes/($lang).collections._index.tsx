import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {SanityPreview} from 'hydrogen-sanity';
import {Suspense, useEffect} from 'react';
import season from 'studio/schemas/documents/season';
import {Link} from '~/components/Link';
import StaggerIndexList from '~/components/framer/StaggerIndexList';

import HomeHero from '~/components/heroes/Home';
import ModuleGrid from '~/components/modules/ModuleGrid';
import ModuleSlideshow from '~/components/modules/ModuleSlideshow';
import type {SanityHomePage} from '~/lib/sanity';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {SEASON_INDEX_PAGE} from '~/queries/sanity/seasons';
import {LAYOUT_QUERY} from '~/queries/sanity/layout';
import {motion} from 'framer-motion';
import {useTheme, Theme} from '~/components/context/ThemeProvider';
import {Typography} from '~/components/global/Typography';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title:
    (data as any)?.page?.seo?.title ??
    (data as any)?.layout?.seo?.title ??
    'Sanity x Hydrogen',
  description:
    (data as any)?.page?.seo?.description ??
    (data as any)?.layout?.seo?.description ??
    'A custom storefront powered by Hydrogen and Sanity',
  media: (data as any)?.page?.seo?.image ?? (data as any)?.layout?.seo?.image,
});

export const handle = {
  seo,
};

export async function loader({context, params}: LoaderFunctionArgs) {
  validateLocale({context, params});

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const [page, layout] = await Promise.all([
    context.sanity.query<SanityHomePage>({
      query: SEASON_INDEX_PAGE,
      cache,
    }),
    context.sanity.query({
      query: LAYOUT_QUERY,
      cache,
    }),
  ]);

  if (!page) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({page, context});

  return defer({
    page,
    layout,
    gids,
    analytics: {
      pageType: AnalyticsPageType.page,
    },
  });
}

export default function Index() {
  const {page, gids} = useLoaderData<typeof loader>();
  const {theme, setTheme} = useTheme();

  useEffect(() => {
    setTheme(Theme.DARK);
    return () => {
      setTheme(Theme.LIGHT);
    };
  }, [setTheme]);

  return (
    <SanityPreview data={page} query={SEASON_INDEX_PAGE}>
      {(page) => (
        <Suspense>
          <Await resolve={gids}>
            <StaggerIndexList
              speed={0.25}
              className="absolute left-0 top-0 flex min-h-full w-full flex-col items-center justify-center overflow-hidden text-center"
            >
              <ul className="flex flex-col items-center justify-center gap-[1.5em] py-[8em] text-center md:gap-[1em]">
                {(page as any)?.map((season: any) => (
                  <li className="opacity-0" key={season.slug}>
                    <Link
                      to={season.slug}
                      title={season.title}
                      className="large-title  mx-auto self-start"
                    >
                      <div className="collection-title transition-transform">
                        <Typography type="collection" size="md">
                          {season.title}
                        </Typography>
                      </div>
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
