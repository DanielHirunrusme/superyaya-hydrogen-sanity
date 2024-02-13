import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';

import {SanityPreview} from 'hydrogen-sanity';
import {Suspense} from 'react';

import ModuleSlideshow, {
  SlideshowCaption,
} from '~/components/modules/ModuleSlideshow';
import type {SanityHomePage} from '~/lib/sanity';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {PROJECT_PAGE_QUERY} from '~/queries/sanity/project';
import {Container} from '~/components/global/Container';
import StaggerIndexList from '~/components/framer/StaggerIndexList';
// import Link from '~/components/elements/Link';
import clsx from 'clsx';
import ProjectSlideshow from '~/components/project/ProjectSlideshow';
import {useState} from 'react';
import {blockContentToPlainText} from 'react-portable-text';
import Leader from '~/components/global/Leader';

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
    query: PROJECT_PAGE_QUERY,
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
    <SanityPreview data={page} query={PROJECT_PAGE_QUERY}>
      {(page) => (
        <Suspense>
          <Await resolve={gids}>
            <>
              <div className="absolute left-0 top-0 flex min-h-screen w-full justify-center text-center md:items-center">
                <div className="relative mx-auto w-full">
                  <Container type="slideshowIndex">
                    <StaggerIndexList className="left-0 flex h-full w-full flex-col justify-center gap-8 text-center md:top-0 md:items-center">
                      {page.map((project, projectIndex) => (
                        <div
                          className={clsx(
                            'mx-auto -mt-[.5em] flex w-full flex-col gap-2 md:mt-0',
                          )}
                          key={project._id}
                        >
                          <ul>
                            <li className="mb-2 opacity-0">
                              <h2>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onProjectModuleClick(projectIndex, 0)
                                  }
                                >
                                  {project.title}
                                </button>
                              </h2>
                            </li>
                            <li>
                              <ul>
                                {project.modules?.map((module, moduleIndex) => (
                                  <li className="opacity-0" key={module._id}>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onProjectModuleClick(
                                          projectIndex,
                                          moduleIndex,
                                        )
                                      }
                                      className="w-full overflow-hidden text-left"
                                    >
                                      <Leader
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
                            </li>
                          </ul>
                        </div>
                      ))}
                    </StaggerIndexList>
                  </Container>
                </div>
              </div>
              {page.map((project, projectIndex) => {
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
              })}
            </>
          </Await>
        </Suspense>
      )}
    </SanityPreview>
  );
}
