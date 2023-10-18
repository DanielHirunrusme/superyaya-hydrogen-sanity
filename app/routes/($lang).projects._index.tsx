import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {SanityPreview} from 'hydrogen-sanity';
import {Suspense} from 'react';
import {Link} from '~/components/Link';
import StaggerIndexList from '~/components/framer/StaggerIndexList';

import type {SanityHomePage} from '~/lib/sanity';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {ARCHIVE_INDEX_PAGE} from '~/queries/sanity/archive';

const seo: SeoHandleFunction = ({data}) => ({
  title: data?.page?.seo?.title || 'SUPER YAYA',
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
    query: ARCHIVE_INDEX_PAGE,
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
    <SanityPreview data={page} query={ARCHIVE_INDEX_PAGE}>
      {(page) => (
        <Suspense>
          <Await resolve={gids}>
            <StaggerIndexList className="left-0  top-0 flex h-full w-full flex-col items-center justify-center gap-8 text-center">
              {page.map((category) => (
                <ul
                  className="mx-auto flex w-full max-w-[700px] flex-col"
                  key={category._id}
                >
                  <li className="opacity-0">
                    <h2>{category.title}</h2>
                  </li>

                  {category.entries?.map((entry, index) => (
                    <li className="opacity-0" key={entry._id}>
                      <Link to={entry.slug} className="leaders">
                        <span>{entry.title}</span>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
               
            </StaggerIndexList>
          </Await>
        </Suspense>
      )}
    </SanityPreview>
  );
}
