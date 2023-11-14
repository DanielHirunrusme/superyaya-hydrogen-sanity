import {Await, useLoaderData} from '@remix-run/react';
import type {SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {Suspense, useEffect, useState} from 'react';
import invariant from 'tiny-invariant';

import PortableText from '~/components/portableText/PortableText';
import type {SanityPage} from '~/lib/sanity';
import {ColorTheme} from '~/lib/theme';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {SEASON_PAGE_QUERY} from '~/queries/sanity/seasons';

import StaggerIndexList from '~/components/framer/StaggerIndexList';
import {Theme, useTheme} from '~/components/context/ThemeProvider';
import {Container} from '~/components/global/Container';
import {Typography} from '~/components/global/Typography';
import CollectionGrid from '~/components/season/CollectionGrid';
import CollectionSlideshow from '~/components/season/CollectionSlideshow';

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
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [theme, setTheme, navVisible] = useTheme();

  useEffect(() => {
    setTheme('dark');
    return () => {
      setTheme('light');
    };
  }, []);

  return (
    <ColorTheme value={page.colorTheme}>
      <Suspense>
        <Await resolve={gids}>
          
          {navVisible && <CollectionSlideshow
            modules={page.modules}
            zoom={zoom}
            setZoom={setZoom}
            index={selectedIndex}
            setIndex={setSelectedIndex}
            detached
            showIndex={showIndex}
            // title={title}
            // outboundLink={outboundLink}
            // outboundLinkText={outboundLinkText}
            mode={theme}
          />}
          {/* <Container type="pageDescription" asChild>
            <div className="mx-auto mb-[36.92vw] text-center md:mb-[7.035vw] xl:mb-[9.4328vw] 2xl:mb-[13.28125vw]">
              <Typography type="rte">
                <div className=" !uppercase !tracking-widest">
                  {page.collection}&nbsp;{page.title}
                </div>
                <br />
                <div className="mx-auto text-left !normal-case">
                  <PortableText blocks={page.body} />
                </div>
              </Typography>
            </div>
          </Container>

          {page.modules && (
            <StaggerIndexList>
              <CollectionGrid
                items={page.modules}
                title={`${page.collection} ${page.title}`}
                showCount
                showIndex
                outboundLink={page.preOrder?.slug}
                outboundLinkText={'Pre-Order'}
                theme={Theme.DARK}
              />
            </StaggerIndexList>
          )} */}
        </Await>
      </Suspense>
    </ColorTheme>
  );
}
