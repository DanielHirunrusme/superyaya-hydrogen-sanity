import { useFetcher, useSearchParams } from '@remix-run/react';
import type { Collection } from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import Button from '~/components/elements/Button';
import SpinnerIcon from '~/components/icons/Spinner';
import ModuleGrid from '~/components/modules/ModuleGrid';
import type { SanityModule } from '~/lib/sanity';
import { combineProductsAndModules } from '~/lib/utils';
import StaggerIndexList from '../framer/StaggerIndexList';
import { stagger, useAnimate } from 'framer-motion';
import { STAGGER_SPEED } from '~/lib/constants';
import { useTheme } from '../context/ThemeProvider';

import CollectionGrid from './CollectionGrid';
export default function ProductGrid({
  collection,
  modules,
  url,
}: {
  collection: Collection;
  modules: SanityModule[];
  url: string;
}) {
  const {plpVisible, navVisible} = useTheme();
  const products = collection?.products?.nodes || [];
  const combinedItems = combineProductsAndModules({
    modules,
    products,
  });

  const [initialItems, setInitialItems] = useState(combinedItems || []);

  const [nextPage, setNextPage] = useState(
    collection?.products?.pageInfo?.hasNextPage,
  );

  const [endCursor, setEndCursor] = useState(
    collection?.products?.pageInfo?.endCursor,
  );

  const [items, setItems] = useState(initialItems);

  const [params] = useSearchParams();
  const sort = params.get('sort');

  // props have changes, reset component state
  if (initialItems !== initialItems) {
    setInitialItems(combinedItems);
    setItems(combinedItems);
    setNextPage(collection?.products?.pageInfo?.hasNextPage);
    setEndCursor(collection?.products?.pageInfo?.endCursor);
  }

  const fetcher = useFetcher();

  function fetchMoreProducts() {
    fetcher.load(
      `${url}?index&cursor=${endCursor}${sort ? `&sort=${sort}` : ''}`,
    );
  }

  const [scope, animate] = useAnimate();
  const { setPlpVisible } = useTheme();

  // Sentinel used for IntersectionObserver to auto-load next page
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(navVisible){
      setPlpVisible(true);
    }
  }, [navVisible]);

  useEffect(() => {
    if (!fetcher.data) return;
    const { collection } = fetcher.data;

    setItems((prev) => [...prev, ...collection.products.nodes]);
    setNextPage(collection.products.pageInfo.hasNextPage);
    setEndCursor(collection.products.pageInfo.endCursor);
  }, [fetcher.data]);

  // Auto-load more when the sentinel is near viewport
  useEffect(() => {
    if (!nextPage) return;
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    let isFetching = false;

    // Compute a large, viewport-based preload margin so we start much sooner
    const preloadMarginPx = typeof window !== 'undefined' ? Math.round(window.innerHeight * 3) : 1200;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Trigger pre-emptively when getting close
        if (entry.isIntersecting && fetcher.state === 'idle' && !isFetching) {
          isFetching = true;
          // Unobserve to avoid duplicate triggers while fetching
          observer.unobserve(sentinel);
          fetchMoreProducts();
        }
      },
      {
        root: null,
        // Start loading well before it enters view
        rootMargin: `${preloadMarginPx}px 0px`,
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [nextPage, fetcher.state, endCursor, sort]);

  return (
    <ul ref={scope}>
      <CollectionGrid items={items} stagger={plpVisible} />
      {/* IntersectionObserver sentinel */}
      {nextPage && <div ref={loadMoreRef} aria-hidden="true" />}
      {nextPage && (
        <div className="flex h-30 items-center justify-center">
          {fetcher.state !== 'idle' ? (
            <div><Button
              disabled
              className='text-indent-[.5em]'
            >
              <span style={{ textIndent: '.1em' }}>Loading...</span>
            </Button></div>
          ) : (
            <div><Button
              className={clsx(fetcher.state !== 'idle' && 'opacity-50')}
              disabled={fetcher.state !== 'idle'}
              onClick={fetchMoreProducts}

            >
              <span style={{ textIndent: '.1em' }}>Load more</span>
            </Button></div>
          )}
        </div>
      )}
    </ul>
  );
}
