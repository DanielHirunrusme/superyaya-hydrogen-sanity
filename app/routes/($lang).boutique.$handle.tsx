import {Await, useLoaderData, useSearchParams} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
// import clsx from 'clsx';
import {Suspense, useEffect, useState} from 'react';
import invariant from 'tiny-invariant';

import ProductGrid from '~/components/collection/ProductGrid';
// import SortOrder from '~/components/collection/SortOrder';
import {SORT_OPTIONS} from '~/components/collection/SortOrder';
import {useTheme, Theme} from '~/components/context/ThemeProvider';
// import CollectionHero from '~/components/heroes/Collection';
import type {SanityCollectionPage} from '~/lib/sanity';
import {ColorTheme} from '~/lib/theme';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {COLLECTION_PAGE_QUERY} from '~/queries/sanity/collection';
import {COLLECTION_QUERY} from '~/queries/shopify/collection';
import {isWithinDateRange} from '~/lib/utils';
import {useAnimate} from 'framer-motion';
import Newsletter from '~/components/modules/Newsletter';
import {Container} from '~/components/global/Container';
import CollectionBreadcrumb from '~/components/collection/CollectionBreadcrumb';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.page?.seo?.title ?? data?.collection?.title,
  description: data?.page?.seo?.description ?? data?.collection?.description,
  media: data?.page?.seo?.image ?? data?.collection?.image,
});

export const handle = {
  seo,
};

export type SortParam =
  | 'price-low-high'
  | 'price-high-low'
  | 'best-selling'
  | 'newest'
  | 'featured'
  | 'title-a-z'
  | 'title-z-a';

const PAGINATION_SIZE = 50;

export async function loader({params, context, request}: LoaderArgs) {
  validateLocale({context, params});

  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const {sortKey, reverse} = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );
  const cursor = searchParams.get('cursor');
  const count = searchParams.get('count');

  invariant(params.handle, 'Missing collection handle');

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const [page, {collection}] = await Promise.all([
    context.sanity.query<SanityCollectionPage>({
      query: COLLECTION_PAGE_QUERY,
      params: {
        slug: params.handle,
      },
      cache,
    }),
    context.storefront.query<{collection: any}>(COLLECTION_QUERY, {
      variables: {
        handle,
        cursor,
        sortKey,
        reverse,
        count: count ? parseInt(count) : PAGINATION_SIZE,
      },
    }),
  ]);

  // Handle 404s
  if (!page || !collection) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({page, context});

  return defer({
    page,
    collection,
    gids,
    sortKey,
    analytics: {
      pageType: AnalyticsPageType.collection,
      handle,
      resourceId: collection.id,
    },
  });
}

export default function Collection() {
  const {collection, page, gids} = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const sort = params.get('sort');

  const products = collection.products.nodes;

  const isPreorderCollection = collection.handle === 'pre-orders';

  return (
    <ColorTheme value={page.colorTheme}>
      <Suspense>
        <Await resolve={gids}>
          {/* Hero */}
          {/* <CollectionHero fallbackTitle={page.title} hero={page.hero} /> */}

          {/* {products.length > 0 && (
              <div
                className={clsx(
                  'mb-8 flex justify-start', //
                  'md:justify-end',
                )}
              >
                <SortOrder key={page._id} initialSortOrder={page.sortOrder} />
              </div>
            )} */}

          {/* No results */}
          {/* {products.length === 0 && <EmptyMessage>No products.</EmptyMessage>}

          <CollectionBreadcrumb collection={collection} />

          {!isPreorderCollection ? (
            <ProductGrid
              collection={collection}
              modules={page.modules}
              url={`/boutique/${collection.handle}`}
              key={`${collection.handle}-${sort}`}
            />
          ) : (
            <PreorderCollection collection={collection}>
              <ProductGrid
                collection={collection}
                modules={page.modules}
                url={`/boutique/${collection.handle}`}
                key={`${collection.handle}-${sort}`}
              />
            </PreorderCollection>
          )} */}

          <EmptyMessage>
            <div>Coming soon. Subscribe for updates.</div>
            <br />
            <Newsletter />
          </EmptyMessage>
        </Await>
      </Suspense>
    </ColorTheme>
  );
}

export const EmptyMessage = ({children}) => {
  return (
    <div className="fixed left-0 top-0 flex h-screen w-full flex-1 flex-col items-center justify-center text-center">
      <Container type="preOrder" asChild>
        <div className="m-auto mx-mobile md:mx-tablet xl:mx-laptop 2xl:mx-desktop">
          {children}
        </div>
      </Container>
    </div>
  );
};

function PreorderCollection({collection, children}) {
  const [theme, setTheme] = useTheme();
  const [scope, animate] = useAnimate();
  const [showProducts, setShowProducts] = useState<boolean>(false);

  useEffect(() => {
    if (!collection.endDate.value || !collection.startDate.value) {
      setTheme(Theme.DARK);
    }
    const date = new Date();
    const start = new Date(collection.startDate.value);
    const end = new Date(collection.endDate.value);

    if (!isWithinDateRange(start, end, date)) {
      setTheme(Theme.DARK);
    } else {
      setTheme(Theme.LIGHT);
    }

    return () => {
      setTheme(Theme.LIGHT);
    };
  }, [collection]);

  // Animate the pre-order message into the product grid
  useEffect(() => {
    if (scope.current) {
      const fadeOut = async () => {
        await animate(scope.current, {opacity: 0}, {duration: 0.1, delay: 3});
        setShowProducts(true);
      };
      fadeOut();
    }
  }, [scope, animate]);

  if (collection.endDate.value && collection.startDate.value) {
    const date = new Date();
    const start = new Date(collection.startDate.value);
    const end = new Date(collection.endDate.value);

    if (isWithinDateRange(start, end, date)) {
      return (
        <>
          {!showProducts ? (
            <div
              className="my-auto flex h-full w-full flex-1 items-center justify-center text-center"
              ref={scope}
            >
              <EmptyMessage>{collection.message?.value || ''}</EmptyMessage>
            </div>
          ) : (
            <>{children}</>
          )}
        </>
      );
    } else {
      return (
        <EmptyMessage>
          <div>{collection.message?.value || ''}</div>
          <br />
          <Newsletter />
        </EmptyMessage>
      );
    }
  }

  return (
    <EmptyMessage>
      No Pre-orders currently. Please check back another time.
    </EmptyMessage>
  );
}

function getSortValuesFromParam(sortParam: SortParam | null) {
  const productSort = SORT_OPTIONS.find((option) => option.key === sortParam);

  return (
    productSort || {
      sortKey: null,
      reverse: false,
    }
  );
}
