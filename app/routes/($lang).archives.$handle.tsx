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
import ModuleSlideshow from '~/components/modules/ModuleSlideshow';
import ModuleGrid from '~/components/modules/ModuleGrid';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.page?.seo?.title,
  description: data?.page?.seo?.description,
  media: data?.page?.seo?.image,
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

  const page = await context.sanity.query<SanityPage>({
    query: ARCHIVE_PAGE_QUERY,
    params: {
      slug: handle,
    },
    cache,
  });

  if (!page) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({page, context});

  return defer({page, gids});
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
          {/* {page.modules && <ModuleGrid items={page.modules} />}
          <div className="flex min-h-screen w-full items-center justify-center text-center">
            <div className="my-24 text-center mx-auto w-[500px]">
              <div className="text-center">{page.title}</div>
              <ul className='w-full max-w-2xl  mx-auto'>
                {page.modules?.map((module, index) => (
                  <li className='leaders' key={`table-${module._key}`}>
                    <span>{module.caption || "No caption set"}</span>
                    <span>{String(index + 1).padStart(2, '0')}</span></li>
                ))}
              </ul>
            </div>
          </div> */}
        </Await>
      </Suspense>
    </ColorTheme>
  );
}
