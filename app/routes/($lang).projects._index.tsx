import { Await, Link, useLoaderData } from '@remix-run/react';
import { AnalyticsPageType, type SeoHandleFunction } from '@shopify/hydrogen';
import { defer, type LoaderArgs } from '@shopify/remix-oxygen';

import { SanityPreview } from 'hydrogen-sanity';
import { Suspense } from 'react';
import cn from 'classnames';

// import ModuleSlideshow, {
//   SlideshowCaption,
// } from '~/components/modules/ModuleSlideshow';
import type { SanityHomePage } from '~/lib/sanity';
import { fetchGids, notFound, validateLocale } from '~/lib/utils';
import { PROJECTS_PAGE_QUERY } from '~/queries/sanity/project';
import { Container } from '~/components/global/Container';
import StaggerIndexList from '~/components/framer/StaggerIndexList';
// import Link from '~/components/elements/Link';
import clsx from 'clsx';
import ProjectSlideshow from '~/components/project/ProjectSlideshow';
import { useState } from 'react';
import { blockContentToPlainText } from 'react-portable-text';
// import Leader from '~/components/global/Leader';
// import {SITE_CONTENT_OFFSET} from '~/lib/constants';
import LeaderWrap from '~/components/global/LeaderWrap';

const seo: SeoHandleFunction = ({ data }) => ({
  title: data?.page?.seo?.title || 'Sanity x Hydrogen',
  description:
    data?.page?.seo?.description ||
    'A custom storefront powered by Hydrogen and Sanity',
});

export const handle = {
  seo,
};

export async function loader({ context, params }: LoaderArgs) {
  validateLocale({ context, params });

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const page = await context.sanity.query<SanityHomePage>({
    query: PROJECTS_PAGE_QUERY,
    cache,
  });

  if (!page) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({ page, context });

  return defer({
    page,
    gids,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Project() {
  const { page, gids } = useLoaderData<typeof loader>();



  // const onProjectModuleClick = (projectIndex, moduleIndex) => {
  //   setActiveProjectIndex(projectIndex);
  //   setActiveModuleIndex(moduleIndex);
  //   setZoom(true);
  // };

  return (
    <SanityPreview data={page} query={PROJECTS_PAGE_QUERY}>
      {(page) => (
        <Suspense>
          <Await resolve={gids}>
            <>
              <div className="w-full">
                <div className={cn('relative mx-auto w-full', 'mb-[4em]')}>
                  <Container type="slideshowIndex">
                    <h1 className='text-center mb-[1em] md:hidden'>Projects</h1>
                    <StaggerIndexList className="left-0 flex h-full w-full flex-col justify-center text-center md:top-0 md:items-center">
                      {page.map((project, projectIndex) => (
                        <div
                          className={clsx(
                            'mx-auto flex w-full flex-col gap-2  ',
                          )}
                          key={project._id}
                        >
                          <ul>
                            <li className="opacity-0 mb-[1em] md:mb-0">
                              {project.slug?.current && <h2>
                                <Link
                                  to={`/projects/${project.slug.current}`}
                                  className="w-full md:overflow-hidden text-left"
                                >
                                  <LeaderWrap
                                    title={project.title}
                                    subtitle={project.year}
                                    index={String(projectIndex + 1).padStart(
                                      2,
                                      '0',
                                    )}
                                  />
                                </Link>
                              </h2>}
                            </li>

                          </ul>
                        </div>
                      ))}
                    </StaggerIndexList>
                  </Container>
                </div>
              </div>

            </>
          </Await>
        </Suspense>
      )}
    </SanityPreview>
  );
}
