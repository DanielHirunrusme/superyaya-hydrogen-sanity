import {Await, useLoaderData, useSearchParams} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import ProductGrid from '~/components/collection/ProductGrid';
import CollectionBreadcrumb from '~/components/collection/CollectionBreadcrumb';
import type {SanityCollectionPage} from '~/lib/sanity';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {COLLECTION_PAGE_QUERY} from '~/queries/sanity/collection';
import {COLLECTION_QUERY} from '~/queries/shopify/collection';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.page?.seo?.title ?? data?.collection?.title,
  description: data?.page?.seo?.description ?? data?.collection?.description,
  media: data?.page?.seo?.image ?? data?.collection?.image,
});

export const handle = {
  seo,
};

const PAGINATION_SIZE = 20;

export async function loader({context, params, request}: any) {
  validateLocale({context, params});

  const searchParams = new URL(request.url).searchParams;
  const cursor = searchParams.get('cursor');
  const count = searchParams.get('count');
  const sortParam = searchParams.get('sort') as any;

  // Reuse boutique sorting util inline (keep minimal logic)
  const SORT_OPTIONS = [
    {key: 'price-low-high', sortKey: 'PRICE', reverse: false},
    {key: 'price-high-low', sortKey: 'PRICE', reverse: true},
    {key: 'best-selling', sortKey: 'BEST_SELLING', reverse: false},
    {key: 'newest', sortKey: 'CREATED', reverse: true},
    {key: 'featured', sortKey: 'MANUAL', reverse: false},
    {key: 'title-a-z', sortKey: 'TITLE', reverse: false},
    {key: 'title-z-a', sortKey: 'TITLE', reverse: true},
  ];
  const productSort = SORT_OPTIONS.find((o) => o.key === sortParam) || {
    sortKey: null,
    reverse: false,
  };

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const handle = 'all';

  const [page, {collection}] = await Promise.all([
    context.sanity.query({
      query: COLLECTION_PAGE_QUERY,
      params: {slug: handle},
      cache,
    }),
    context.storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        cursor,
        sortKey: productSort.sortKey,
        reverse: productSort.reverse,
        count: count ? parseInt(count) : PAGINATION_SIZE,
      },
    }),
  ]);

  if (!page || !collection) {
    throw notFound();
  }

  const gids = fetchGids({page, context});

  return defer({
    page,
    collection,
    gids,
    analytics: {
      pageType: AnalyticsPageType.collection,
      handle,
      resourceId: collection.id,
    },
  });
}

export default function Index() {
  const {collection, page, gids} = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const sort = params.get('sort');

  const products = collection?.products?.nodes || [];

  return (
    <div className="relative">
      <Suspense>
        <Await resolve={gids}>
          {products.length === 0 ? null : (
            <>
              <CollectionBreadcrumb
                collection={collection}
                pathnameOverride={`/boutique/${collection.handle}`}
              />
              <ProductGrid
                collection={collection}
                modules={page.modules}
                url={`/boutique/${collection.handle}`}
                key={`${collection.handle}-${sort}`}
              />
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
