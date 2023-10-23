import {Await, useLoaderData} from '@remix-run/react';
import type {SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {Suspense, useState} from 'react';
import invariant from 'tiny-invariant';

import PortableText from '~/components/portableText/PortableText';
import type {SanityPage} from '~/lib/sanity';
import {ColorTheme} from '~/lib/theme';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {SEASON_PAGE_QUERY} from '~/queries/sanity/seasons';
import {SanityLink} from '~/lib/sanity';
import {Link} from '~/components/Link';

import {useMatches} from '@remix-run/react';
import ModuleGrid from '~/components/modules/ModuleGrid';
import Button from '~/components/elements/Button';
import ModuleSlideshow from '~/components/modules/ModuleSlideshow';
import StaggerIndexList from '~/components/framer/StaggerIndexList';
import { Theme } from '~/components/context/ThemeProvider';

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
    query: SEASON_PAGE_QUERY,
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
  const [showIndex, setShowIndex] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [index, setIndex] = useState(0);

  const toggleIndex = () => {
    setShowIndex(!showIndex);
  };

  return (
    <ColorTheme value={page.colorTheme}>
      <Suspense>
        <Await resolve={gids}>
          <div className="mb-22 text-center font-serif">
            <div className="!uppercase text-xxs 2xl:text-md">
              {page.collection}&nbsp;{page.title}
            </div>
            <br />
            <div className="mx-auto max-w-[19.1875rem] 2xl:max-w-[21.796875vw] text-left !normal-case">
              <PortableText blocks={page.body} />
            </div>
          </div>
          {page.modules && (
            <StaggerIndexList>
              <ModuleGrid
                items={page.modules}
                title={`${page.collection} ${page.title}`}
                showCount
                showIndex
                outboundLink={page.preOrder?.slug}
                outboundLinkText={"Pre-Order"}
                theme={Theme.DARK}
              />
            </StaggerIndexList>
          )}
        </Await>
      </Suspense>
    </ColorTheme>
  );
}
