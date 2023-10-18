import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {SanityPreview} from 'hydrogen-sanity';
import {Suspense} from 'react';
import clsx from 'clsx';
import {Link} from '~/components/Link';
import {GRID_GAP} from '~/lib/constants';
import type {SanityHomePage} from '~/lib/sanity';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {INDEX_QUERY} from '~/queries/sanity/index';
import {format} from 'date-fns';
import {Disclosure} from '@headlessui/react';
import ProductModule from '~/components/modules/Product';
import StaggerIndexList from '~/components/framer/StaggerIndexList';
import PortableText from '~/components/portableText/PortableText';
import ModuleGrid from '~/components/modules/ModuleGrid';

const seo: SeoHandleFunction = ({data}) => ({
  title: data?.page?.seo?.title || 'SUPER YAYA',
  description:
    data?.page?.seo?.description ||
    'A custom storefront powered by Hydrogen and Sanity',
});

export const handle = {
  seo,
};

const COLUMN_SIZES = [
  'md:w-20 flex-grow-0 text-left pl-2 py-1 uppercase',
  'flex-1 text-left py-1 overflow-hidden uppercase',
  'hidden md:block w-48 flex-grow-0 text-left py-1 uppercase',
  'hidden md:block w-32 flex-grow-0 text-left py-1 uppercase',
  'hidden md:block w-16 flex-grow-0 text-right pr-2 py-1 uppercase',
];

export async function loader({context, params}: LoaderArgs) {
  validateLocale({context, params});

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const page = await context.sanity.query<SanityHomePage>({
    query: INDEX_QUERY,
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
      pageType: AnalyticsPageType.page,
    },
  });
}

export default function IndexPage() {
  const {page, gids} = useLoaderData<typeof loader>();
  console.log(page);
  return (
    <SanityPreview data={page} query={INDEX_QUERY}>
      {(page) => (
        <Suspense>
          <Await resolve={gids}>
            <StaggerIndexList className="mx-auto flex w-full max-w-[1160px] 2xl:max-w-[1836px]">
              <ul className="w-full " >
                <li className="opacity-0  border-b-[.8px] 2xl:border-b">
                  <nav
                    className={clsx(
                      'hidden w-full flex-1 justify-between text-left md:flex',
                      GRID_GAP,
                    )}
                  >
                    <button className={COLUMN_SIZES[0]}>NO.</button>
                    <button className={COLUMN_SIZES[1]}>Title</button>
                    <button className={COLUMN_SIZES[2]}>Category</button>
                    <button className={COLUMN_SIZES[3]}>Kind</button>
                    <button className={COLUMN_SIZES[4]}>Year</button>
                  </nav>
                </li>

                {page.map((item, index) => {
                  const year = item.year.split('-')[0];
                  return (
                    <Disclosure key={item._id}>
                      {({open}) => (
                        <li
                          className="flex-1 opacity-0 overflow-hidden border-b-[.8px] 2xl:border-b"
                          tabIndex={index}
                         
                        >
                          <Disclosure.Button
                            className={clsx(
                              'flex w-full flex-1 justify-between text-left overflow-hidden',
                              GRID_GAP,
                              !open && ' hover:opacity-50',
                            )}
                          >
                            <div className={COLUMN_SIZES[0]}>
                              {String(index).padStart(3, '0')}
                            </div>
                            <div className={COLUMN_SIZES[1]}>
                              <div className=' truncate'>{item.title}</div>
                              {/* Mobile information */}
                              {open && (
                                <div className="md:hidden">
                                  {item.kind && <div>Kind: {item.kind}</div>}
                                  {item.category && (
                                    <div>Category: {item.category}</div>
                                  )}
                                  {item.year && <div>Year: {year}</div>}
                                </div>
                              )}
                            </div>
                            <div className={COLUMN_SIZES[2]}>{item.kind}</div>
                            <div className={COLUMN_SIZES[3]}>
                              {item.category || ''}
                            </div>
                            <div className={COLUMN_SIZES[4]}>{year}</div>
                          </Disclosure.Button>
                          <Disclosure.Panel>
                            <div
                              className={clsx(
                                'flex w-full flex-1 justify-between text-left',
                                GRID_GAP,
                                'font-body text-xxs'
                              )}
                            >
                              <div
                                className={clsx(
                                  COLUMN_SIZES[0],
                                  'hidden md:block',
                                )}
                              ></div>
                              <div className={COLUMN_SIZES[1]}>
                                {item._type == 'productWithVariant' ? (
                                  <div>
                                    <div
                                    className='rte body'
                                      dangerouslySetInnerHTML={{
                                        __html: item.description,
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <PortableText blocks={item.description} className='body' />
                                  </div>
                                )}
                              </div>
                              <div className={COLUMN_SIZES[2]}> </div>
                              <div className={COLUMN_SIZES[3]}></div>
                              <div className={COLUMN_SIZES[4]}></div>
                            </div>
                            <div className="mb-4 mt-2 md:ml-22">
                              <IndexImages item={item} />
                            </div>
                          </Disclosure.Panel>
                        </li>
                      )}
                    </Disclosure>
                  );
                })}
              </ul>
            </StaggerIndexList>
          </Await>
        </Suspense>
      )}
    </SanityPreview>
  );
}

function IndexImages({item}) {
  switch (item._type) {
    case 'productWithVariant':
      return (
        <div>
          <ProductModule module={item} layout="images" />
        </div>
      );
    default:
      return (
        <ModuleGrid
          items={item.modules}
          className="relative grid grid-cols-4 gap-2 md:flex"
        />
      );
  }
}
