import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {SanityPreview} from 'hydrogen-sanity';
import {Suspense} from 'react';
import {Link} from '~/components/Link';

import type {SanityHomePage} from '~/lib/sanity';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {ARCHIVE_INDEX_PAGE} from '~/queries/sanity/archive';

const seo: SeoHandleFunction = ({data}) => ({
  title: data?.page?.seo?.title || 'Superyaya',
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
            <div className="left-0  top-0 flex h-full w-full flex-col items-center justify-center gap-8 text-center">
              {page.map((category) => (
                <div
                  className="mx-auto flex w-full max-w-[700px] flex-col gap-2"
                  key={category._id}
                >
                  <div>{category.title}</div>
                  <ul>
                    {category.entries?.map((entry, index) => (
                      <Link as="li" to={entry.slug} className="leaders" key={entry._id}>
                        <span>{entry.title}</span>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                      </Link>
                    ))}
                  </ul>
                </div>
              ))}
              {/* <div className="pb-20 flex flex-col items-center justify-center text-center">
                {page?.map((archive) => (
                  <Link
                    to={archive.slug}
                    title={archive.title}
                    key={archive.slug}
                    className="font-cursive text-2xl self-start mx-auto !normal-case md:text-3xl lg:text-4xl 2xl:text-5xl"
                  >
                    {archive.title}
                  </Link>
                ))}
              </div> */}
            </div>
          </Await>
        </Suspense>
      )}
    </SanityPreview>
  );
}
