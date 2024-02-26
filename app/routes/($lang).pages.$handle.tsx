import {Await, useLoaderData} from '@remix-run/react';
import type {SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {Suspense, useState, useEffect} from 'react';
import invariant from 'tiny-invariant';

import PageHero from '~/components/heroes/Page';
import PortableText from '~/components/portableText/PortableText';
import type {SanityPage} from '~/lib/sanity';
import {ColorTheme} from '~/lib/theme';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {PAGE_QUERY} from '~/queries/sanity/page';
import {SanityLink} from '~/lib/sanity';
import {Link} from '~/components/Link';

import {useMatches} from '@remix-run/react';
import {Container} from '~/components/global/Container';
import {Typography} from '~/components/global/Typography';
import StaggerIndexList from '~/components/framer/StaggerIndexList';

import SanityImage from '~/components/media/SanityImage';
import {motion, useAnimate} from 'framer-motion';
import { useTheme } from '~/components/context/ThemeProvider';

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
    query: PAGE_QUERY,
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
  const [root] = useMatches();

  const layout = root.data?.layout;
  const {assistance} = layout || {};
  const {page, gids} = useLoaderData<typeof loader>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [theme, setTheme, navVisible] = useTheme();

  const renderLinks = assistance?.links.map((link: SanityLink) => {
    if (link._type === 'linkExternal') {
      return (
        <li className="mb-6 opacity-0" key={link._key}>
          <a
            className="linkTextNavigation"
            href={link.url}
            rel="noreferrer"
            target={link.newWindow ? '_blank' : '_self'}
          >
            {link.title}
          </a>
        </li>
      );
    }
    if (link._type === 'linkInternal') {
      if (!link.slug) {
        return null;
      }

      return (
        <li key={link._key} className="opacity-0">
          <Link
            className="linkTextNavigation linkTextNavigationPage"
            to={link.slug}
          >
            {link.title}
          </Link>
        </li>
      );
    }
    return null;
  });

  const onComplete = () => {
    setMenuVisible(true);
  };

  if (page.slug?.current.includes('studio')) {
    return (
 
        <ColorTheme value={page.colorTheme}>
          <Suspense>
            <Await resolve={gids}>
              {/* Page hero */}
              {/* <PageHero fallbackTitle={page.title} hero={page.hero} /> */}
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                <Container type="pageDescription" asChild>
                  <div
                    className={clsx(
                      'mx-auto grid w-full grid-cols-10 gap-[2.56vw] md:block',
                    )}
                  >
                    <div className="col-span-8 col-start-2">
                      <Typography type="rte">
                        {page.displayAssistanceMenu && assistance && (
                          <StaggerIndexList target="ol li">
                            <ol className="rte mb-6 flex list-inside list-alpha flex-col !uppercase">
                              {renderLinks}
                            </ol>
                          </StaggerIndexList>
                        )}
                        {/* Body */}
                        {page.body && (
                          <PortableText blocks={page.body} centered />
                        )}
                      </Typography>
                    </div>
                  </div>
                </Container>
              </div>
            </Await>
          </Suspense>
        </ColorTheme>
 
    );
  } else {
    return (
      <ColorTheme value={page.colorTheme}>
        <Suspense>
          <Await resolve={gids}>
            {/* Page hero */}
            {/* <PageHero fallbackTitle={page.title} hero={page.hero} /> */}
            <Container type="assistance" asChild>
              <div className={clsx('mx-auto w-full pb-24 !uppercase page-rte ')}>
                
                  {/* {page.displayAssistanceMenu && assistance && (
                    <StaggerIndexList target="ol li" onComplete={onComplete}>
                      <ol className="rte mb-6 flex list-inside list-alpha flex-col !uppercase">
                        {renderLinks}
                      </ol>
                    </StaggerIndexList>
                  )} */}

                  {/* Body */}
                  {page.body && navVisible && (
                    <PortableText blocks={page.body} centered />
                  )}
                
              </div>
            </Container>
          </Await>
        </Suspense>
      </ColorTheme>
    );
  }
}

function Cardwrapper(props: any) {
  const [scope, animate] = useAnimate();
  const {children} = props;

  const [root] = useMatches();
  const {sanityDataset, sanityProjectID} = root.data;
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [introDone, setIntroDone] = useState<boolean>(false);
  const [cardVisible, setCardVisible] = useState<boolean>(true);

  useEffect(() => {
    const getTargetWidth = () => {
      const wh = window.innerHeight;
      const aspectRatio =
        root.data?.layout?.introImage?.metadata?.dimensions?.aspectRatio;
      const w = wh * aspectRatio;
      return w;
    };

    setTargetWidth(getTargetWidth());
  }, [targetWidth, root]);

  return (
    <>
      <div ref={scope} className="fixed left-0 top-0 z-10 h-screen w-full ">
        <motion.div
          animate={{transform: `translate(-50%, 400%) rotate(90deg)`}}
          transition={{delay: 2.25, duration: 2, ease: 'easeIn'}}
          style={{
            aspectRatio:
              root.data.layout?.introImage?.metadata?.dimensions?.aspectRatio,
          }}
          className="absolute left-1/2 top-1/2  z-10 w-[112vw]  -translate-x-1/2 -translate-y-1/2 rotate-90 transform md:w-[33.33vw] md:rotate-0 xl:w-[27.546vw] 2xl:w-[27.265vw]"
        >
          <SanityImage
            alt={'SUPER YAYA'}
            dataset={sanityDataset}
            layout="responsive"
            objectFit="contain"
            projectId={sanityProjectID}
            sizes="50vw, 100vw"
            src={root.data?.layout?.introImage?._id}
          />
        </motion.div>

        <>{children}</>
      </div>
      <motion.div
        animate={{opacity: 0}}
        transition={{delay: 1, duration: 1}}
        className="fixed left-0 top-0 h-screen w-full bg-black"
      ></motion.div>
    </>
  );
}
