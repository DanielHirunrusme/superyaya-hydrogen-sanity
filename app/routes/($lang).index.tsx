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

const seo: SeoHandleFunction = ({data}) => ({
  title: data?.page?.seo?.title || 'Superyaya',
  description:
    data?.page?.seo?.description ||
    'A custom storefront powered by Hydrogen and Sanity',
});

export const handle = {
  seo,
};

const COLUMN_SIZES = [
  'md:w-20 flex-grow-0 text-left pl-2',
  'flex-1 text-left',
  'hidden md:block w-48 flex-grow-0 text-left',
  'hidden md:block w-32 flex-grow-0 text-left',
  'hidden md:block w-16 flex-grow-0 text-right pr-2',
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
  return (
    <SanityPreview data={page} query={INDEX_QUERY}>
      {(page) => (
        <Suspense>
          <Await resolve={gids}>
            <StaggerIndexList className="mx-auto flex w-full max-w-[1000px] ">
              <ul className='w-full divide-y-[1px] divide-black border-b'>
                <li className='opacity-0'>
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

                {page.map((item, index) => (
                  <Disclosure key={item._id}>
                    {({open}) => (
                      <li className="w-full flex-1 opacity-0" tabIndex={index}>
                        <Disclosure.Button
                          className={clsx(
                            'flex w-full flex-1 justify-between text-left',
                            GRID_GAP,
                            !open && ' hover:opacity-50',
                          )}
                        >
                          <div className={COLUMN_SIZES[0]}>
                            {String(index).padStart(3, '0')}
                          </div>
                          <div className={COLUMN_SIZES[1]}>
                            <div className="truncate">{item.title}</div>
                            {/* Mobile information */}
                            {open && (
                              <div className="md:hidden">
                                {item.kind && <div>Kind: {item.kind}</div>}
                                {item.category && (
                                  <div>Category: {item.category}</div>
                                )}
                                {item.year && (
                                  <div>
                                    Year:{' '}
                                    {item.year
                                      ? format(new Date(item.year), 'yyyy')
                                      : ''}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className={COLUMN_SIZES[2]}>{item.kind}</div>
                          <div className={COLUMN_SIZES[3]}>
                            {item.category || ''}
                          </div>
                          <div className={COLUMN_SIZES[4]}>
                            {item.year
                              ? format(new Date(item.year), 'yyyy')
                              : ''}
                          </div>
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          <div
                            className={clsx(
                              'flex w-full flex-1 justify-between text-left',
                              GRID_GAP,
                            )}
                          >
                            <div
                              className={clsx(
                                COLUMN_SIZES[0],
                                'hidden md:block',
                              )}
                            ></div>
                            <div className={COLUMN_SIZES[1]}>
                              {item._type == 'productWithVariant' ||
                              item._type == 'collection' ? (
                                <div>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: item.description,
                                    }}
                                  />
                                </div>
                              ) : (
                                <div>text</div>
                              )}
                            </div>
                            <div className={COLUMN_SIZES[2]}> </div>
                            <div className={COLUMN_SIZES[3]}></div>
                            <div className={COLUMN_SIZES[4]}></div>
                          </div>
                          <div className="mb-4 mt-2 md:ml-24">
                            <IndexImages item={item} />
                          </div>
                        </Disclosure.Panel>
                      </li>
                    )}
                  </Disclosure>
                ))}
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
      return <div>default</div>;
  }
}
