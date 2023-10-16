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
  'w-12 flex-grow-0',
  'flex-1',
  'w-48 flex-grow-0',
  'w-32 flex-grow-0',
  'w-12 flex-grow-0',
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
            <ul className="mx-auto flex w-full max-w-[1000px] flex-col divide-y-[1px] divide-black">
              {page.map((item, index) => (
                <Disclosure key={item._id}>
                  {({open}) => (
                    <li className="w-full flex-1" tabIndex={index}>
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
                        <div className={COLUMN_SIZES[1]}>{item.title}</div>
                        <div className={COLUMN_SIZES[2]}>{item.kind}</div>
                        <div className={COLUMN_SIZES[3]}>
                          {item.category || ''}
                        </div>
                        <div className={COLUMN_SIZES[4]}>
                          {item.year ? format(new Date(item.year), 'yyyy') : ''}
                        </div>
                      </Disclosure.Button>
                      <Disclosure.Panel>
                        <div
                          className={clsx(
                            'flex w-full flex-1 justify-between text-left',
                            GRID_GAP,
                          )}
                        >
                          <div className={COLUMN_SIZES[0]}></div>
                          <div className={COLUMN_SIZES[1]}>
                            {item._type == 'product' ||
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
                        <div className='ml-16 mt-2 mb-4'>
                          <IndexImages item={item} />
                        </div>
                      </Disclosure.Panel>
                    </li>
                  )}
                </Disclosure>
              ))}
            </ul>
          </Await>
        </Suspense>
      )}
    </SanityPreview>
  );
}

function IndexImages({item}) {
  switch (item._type) {
    case 'productWithVariant':
      
      return <div><ProductModule module={item} layout='images' /></div>;
    default:
      return <div>default</div>;
  }
}
