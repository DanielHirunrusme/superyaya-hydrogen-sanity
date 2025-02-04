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
import {motion} from 'framer-motion';

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

function Intro({title, onIntroComplete}) {
  return (
    <motion.div
      animate={{opacity: 0}}
      transition={{delay: 2, duration: 1}}
      onAnimationComplete={onIntroComplete}
      className="pointer-events-none fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-white"
    >
      <motion.div
        animate={{color: 'rgba(0, 0, 0, 1)'}}
        transition={{delay: 1, duration: 1}}
        className="large-title relative z-50 text-white"
      >
        <div className="collection-title">
          <Typography type="collection">{title}</Typography>
        </div>
      </motion.div>
      <motion.div
        transition={{delay: 1, duration: 1}}
        animate={{background: 'rgba(255, 255, 255, 1)'}}
        className="fixed left-0 top-0 z-10 h-screen w-screen bg-black"
      />
    </motion.div>
  );
}

export default function Page() {
  const {page, gids} = useLoaderData<typeof loader>();
  const [index, setIndex] = useState(0);
  const [introComplete, setIntroComplete] = useState(true);
  const {setTheme} = useTheme();

  useEffect(() => {
    setTheme(Theme.LIGHT);
    if (index === page.modules?.length) {
    } else {
      // setTheme('dark');
    }
    return () => {
      setTheme(Theme.LIGHT);
    };
  }, []);

  const onIntroComplete = () => {
    setIntroComplete(true);
  };

  return (
    <ColorTheme value={page.colorTheme}>
      <Suspense>
        <Await resolve={gids}>
          <Container type="pageDescription" asChild>
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

          <Intro onIntroComplete={onIntroComplete} title={page.title} />

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
          )}

          {/* <CollectionSlideshow
              modules={page.modules}
              zoom={zoom}
              setZoom={setZoom}
              index={index}
              setIndex={setIndex}
              detached
              showIndex={showIndex}
              setShowIndex={setShowIndex}
              title={page.title}
              // outboundLink={outboundLink}
              // outboundLinkText={outboundLinkText}
              mode={theme}
            >
              <Container type="pageDescription" asChild>
                <div className="-mx-mobile md:mx-auto mb-[36.92vw] text-center md:mb-[7.035vw] xl:mb-[9.4328vw] 2xl:mb-[13.28125vw]">
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
            </CollectionSlideshow> */}
        </Await>
      </Suspense>
    </ColorTheme>
  );
}
