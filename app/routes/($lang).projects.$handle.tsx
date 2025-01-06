import {Await, Link, useLoaderData} from '@remix-run/react';
import type {SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import invariant from 'tiny-invariant';

// import PortableText from '~/components/portableText/PortableText';
import type {SanityPage} from '~/lib/sanity';
import {ColorTheme} from '~/lib/theme';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {PROJECT_PAGE_QUERY} from '~/queries/sanity/project';
import ProjectSlideshow from '~/components/project/ProjectSlideshow';

// import ModuleGrid from '~/components/modules/ModuleGrid';
// import Leader from '~/components/global/Leader';

import {SITE_MARGINS_X, SITE_MARGINS_Y} from '~/lib/constants';
import clsx from 'clsx';
// import ModuleSlideshow from '~/components/modules/ModuleSlideshow';
// import {useTheme} from '~/components/context/ThemeProvider';

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
    query: PROJECT_PAGE_QUERY,
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

  console.log(page);

  return (
    <ColorTheme value={page.colorTheme}>
      <Suspense>
        <Await resolve={gids}>
          <ProjectSlideshow
            key={page._id}
            modules={page.modules}
            index={0}
            title={page.title || ""}
            body={page.body}
          />
          <Link
            to="/projects"
            title="Projects Index"
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              'linkTextNavigation fixed bottom-0 right-0 z-50 flex items-center leading-none text-black !no-underline',
              SITE_MARGINS_X,
              SITE_MARGINS_Y,
            )}
          >
            Index
          </Link>
        </Await>
      </Suspense>
    </ColorTheme>
  );
}
