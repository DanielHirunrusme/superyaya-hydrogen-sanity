import {Await, Link, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';

import {SanityPreview} from 'hydrogen-sanity';
import {Suspense} from 'react';
import cn from 'classnames';

// import ModuleSlideshow, {
//   SlideshowCaption,
// } from '~/components/modules/ModuleSlideshow';
import type {SanityHomePage} from '~/lib/sanity';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {PROJECTS_PAGE_QUERY} from '~/queries/sanity/project';
import {Container} from '~/components/global/Container';
import StaggerIndexList from '~/components/framer/StaggerIndexList';
// import Link from '~/components/elements/Link';
import clsx from 'clsx';
import ProjectSlideshow from '~/components/project/ProjectSlideshow';
import {useState} from 'react';
import {blockContentToPlainText} from 'react-portable-text';
// import Leader from '~/components/global/Leader';
// import {SITE_CONTENT_OFFSET} from '~/lib/constants';
import LeaderWrap from '~/components/global/LeaderWrap';

const seo: SeoHandleFunction = ({data}) => ({
  title: data?.page?.seo?.title || 'Sanity x Hydrogen',
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
    query: PROJECTS_PAGE_QUERY,
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
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Project() {
  const {page, gids} = useLoaderData<typeof loader>();
  const [activeProjectIndex, setActiveProjectIndex] = useState(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(null);
  const [zoom, setZoom] = useState(false);

  const onProjectModuleClick = (projectIndex, moduleIndex) => {
    setActiveProjectIndex(projectIndex);
    setActiveModuleIndex(moduleIndex);
    setZoom(true);
  };

  return (
    <SanityPreview data={page} query={PROJECTS_PAGE_QUERY}>
      {(page) => (
        <Suspense>
          <Await resolve={gids}>
            <>
              <div className="w-full">
                <div className={cn('relative mx-auto w-full', 'mb-[4em]')}>
                  <Container type="slideshowIndex">
                    <StaggerIndexList className="left-0 flex h-full w-full flex-col justify-center text-center md:top-0 md:items-center">
                      {page.map((project, projectIndex) => (
                        <div
                          className={clsx(
                            'mx-auto   flex w-full flex-col gap-2  ',
                          )}
                          key={project._id}
                        >
                          <ul>
                            <li className="opacity-0">
                              <h2>
                                <Link
                                  to={`/projects/${project.slug.current}`}
                                  className="w-full overflow-hidden text-left"
                                >
                                  <LeaderWrap
                                    title={project.title}
                                    index={String(projectIndex + 1).padStart(
                                      2,
                                      '0',
                                    )}
                                  />
                                </Link>
                              </h2>
                            </li>
                            {/* <li>
                              <ul>
                                {project.modules?.map((module, moduleIndex) => (
                                  <li className="opacity-0" key={module._id}>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onProjectModuleClick(
                                          projectIndex,
                                          moduleIndex + 1,
                                        )
                                      }
                                      className="w-full overflow-hidden text-left"
                                    >
                                      <LeaderWrap
                                        title={blockContentToPlainText(
                                          module.caption || [],
                                        )}
                                        index={String(moduleIndex + 1).padStart(
                                          2,
                                          '0',
                                        )}
                                      />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </li> */}
                          </ul>
                        </div>
                      ))}
                    </StaggerIndexList>
                  </Container>
                </div>
              </div>
              {/* {page?.map((project, projectIndex) => {
                if (activeProjectIndex === projectIndex && zoom) {
                  return (
                    <ProjectSlideshow
                      key={project._id}
                      zoom={zoom}
                      setZoom={setZoom}
                      modules={project.modules}
                      index={activeModuleIndex}
                      title={project.title}
                      body={project.body}
                    />
                  );
                }
              })} */}
            </>
          </Await>
        </Suspense>
      )}
    </SanityPreview>
  );
}
