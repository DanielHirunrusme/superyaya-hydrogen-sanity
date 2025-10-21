import {Await, useLoaderData} from '@remix-run/react';
import type {SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import invariant from 'tiny-invariant';

import PortableText from '~/components/portableText/PortableText';
import type {SanityPage} from '~/lib/sanity';
import {ColorTheme} from '~/lib/theme';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {ARCHIVE_PAGE_QUERY} from '~/queries/sanity/archive';
import {LAYOUT_QUERY} from '~/queries/sanity/layout';
import ModuleSlideshow from '~/components/modules/ModuleSlideshow';
import ModuleGrid from '~/components/modules/ModuleGrid';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.page?.seo?.title ?? data?.layout?.seo?.title,
  description: data?.page?.seo?.description ?? data?.layout?.seo?.description,
  media: data?.page?.seo?.image ?? data?.layout?.seo?.image,
});

export const handle = {
  seo,
};

export async function loader({params, context}: LoaderArgs) {
  validateLocale({context, params});

  const {handle} = params;
  invariant(handle, 'Missing page handle');

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const [page, layout] = await Promise.all([
    context.sanity.query<SanityPage>({
      query: ARCHIVE_PAGE_QUERY,
      params: {
        slug: handle,
      },
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

  return defer({page, layout, gids});
}

export default function Page() {
  const {page, gids} = useLoaderData<typeof loader>();
  return (
    <ColorTheme value={page.colorTheme}>
      <Suspense>
        <Await resolve={gids}>
          {/* THIS SHOULD JUST GO STRAIGHT INTO A SLIDESHOW
          <div className="mb-32 mt-24 text-center font-serif">
            <div>{page.title}</div>
            <div className="mx-auto max-w-lg text-left">
              <PortableText blocks={page.body} />
            </div>
          </div> */}
          {page.modules && (
            <ModuleSlideshow
              modules={page.modules}
              title={page.title}
              showIndex
              outboundLink={'/archives'}
              outboundLinkText={page.category.title}
            />
          )}
           
        </Await>
      </Suspense>
    </ColorTheme>
  );
}
