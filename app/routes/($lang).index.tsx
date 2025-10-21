import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {SanityPreview} from 'hydrogen-sanity';
import React, {Suspense, useState, useEffect, useMemo} from 'react';
import clsx from 'clsx';
// import {Link} from '~/components/Link';
// import {GRID_GAP} from '~/lib/constants';
import type {SanityHomePage} from '~/lib/sanity';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {COMBINED_INDEX_QUERY} from '~/queries/sanity/combined-index';
import {INDEX_COLOR_QUERY} from '~/queries/sanity/index';
import {LAYOUT_QUERY} from '~/queries/sanity/layout';
import {format} from 'date-fns';
import {Disclosure} from '@headlessui/react';
import ProductModule from '~/components/modules/Product';
import StaggerIndexList from '~/components/framer/StaggerIndexList';
import PortableText from '~/components/portableText/PortableText';
import ModuleGrid from '~/components/modules/ModuleGrid';
import {ArrowDownIcon} from '~/components/icons/ArrowDown';
import {ArrowUpIcon} from '~/components/icons/ArrowUp';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {Container} from '~/components/global/Container';
import {Typography} from '~/components/global/Typography';

const seo: SeoHandleFunction = ({data}) => ({
  title: 
    data?.page?.seo?.title ?? 
    data?.layout?.seo?.title ?? 
    'SUPER YAYA',
  description:
    data?.page?.seo?.description ??
    data?.layout?.seo?.description ??
    'A custom storefront powered by Hydrogen and Sanity',
  media: data?.page?.seo?.image ?? data?.layout?.seo?.image,
});

export const handle = {
  seo,
};

const COLUMN_SIZES = [
  'w-[3.5em] md:w-auto col-span-1 text-left pl-2 2xl:pl-4 py-1.5 uppercase flex gap-1',
  'col-span-6 flex-1 text-left py-1.5 overflow-hidden uppercase md:flex gap-1',
  'col-span-2 hidden md:flex  text-left py-1.5 uppercase gap-1',
  'col-span-2 hidden md:flex  text-left py-1.5 uppercase gap-1',
  'col-span-1 hidden md:flex  text-right justify-end pr-2 2xl:pr-4 py-1.5 uppercase gap-1',
];

export async function loader({context, params}: LoaderArgs) {
  validateLocale({context, params});

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const [page, layout, colors] = await Promise.all([
    context.sanity.query<SanityHomePage>({
      query: COMBINED_INDEX_QUERY,
      cache,
    }),
    context.sanity.query({
      query: LAYOUT_QUERY,
      cache,
    }),
    context.sanity.query<SanityHomePage>({
      query: INDEX_COLOR_QUERY,
      cache,
    }),
  ]);

  if (!page) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({page, context});

  return defer({
    page,
    layout,
    colors,
    gids,
    analytics: {
      pageType: AnalyticsPageType.page,
    },
  });
}

export type IndexItem = {
  id: number;
  _type: string;
  title: string;
  description: any;
  category: string;
  kind: string;
  year: string;
  _id: string;
  slug: string;
  modules?: any;
  productWithVariant?: any;
};

function IndexTable({page, colors, resolvedGids}: {page: any, colors: any, resolvedGids: any[]}) {
  const [data, setData] = useState<IndexItem[]>([]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo<ColumnDef<IndexItem>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'No.',
        cell: (cell) => {
          return <div>{String(cell.getValue() + 1).padStart(3, '0')}</div>;
        },
      },
      {
        accessorKey: 'title',
        header: 'Title',
      },
      {
        accessorKey: 'kind',
        header: 'Type',
      },
      {
        accessorKey: 'category',
        header: 'Category',
      },

      {
        accessorKey: 'year',
        header: 'Year',
        cell: (cell) => {
          const year = cell.getValue()?.split('-')[0];
          return <div>{year}</div>;
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  useEffect(() => {
    if (page && resolvedGids) {
      // Create a lookup map of Shopify products by ID
      const shopifyProductsMap = new Map();
      resolvedGids.forEach((product: any) => {
        if (product.id) {
          shopifyProductsMap.set(product.id, product);
        }
      });

      // Combine all arrays into one flat array
      const allItems = [
        ...page.products,
        ...page.seasons,
        ...page.collaborations,
        ...page.projects,
        ...page.archives,
      ];
      
      const d = allItems.map((item: any, index: number) => {
        if (item._type === 'productWithVariant') {
          // Find matching Shopify product by GID
          const shopifyProduct = shopifyProductsMap.get(item.gid);
          const year = shopifyProduct?.year?.value || item.year;
          
          return {
            id: index,
            category: item.category,
            description: item.description,
            kind: item.kind,
            modules: item.modules,
            slug: item.slug,
            title: item.title,
            year: year,
            _id: item._id,
            productWithVariant: item.productWithVariant,
            _type: item._type,
          };
        } else {
          return {
            id: index,
            category: item.category,
            description: item.description,
            kind: item.kind,
            modules: item.modules,
            slug: item.slug,
            title: item.title,
            year: item.year,
            _id: item._id,
            _type: item._type,
          };
        }
      });
      setData(d);
    }
  }, [page, resolvedGids]);

  const getHoverColor = (item: any) => {
    switch (item.original.kind) {
      case 'collection':
        return `hover:text-${colors.collectionColor}`;
      case 'Archive':
        return `hover:text-${colors.projectColor}`;
    }
  };

  const getRowColor = (item: any) => {
    switch (item.original.kind) {
      case 'collection':
        return colors.collectionColor;
      case 'Archive':
      case 'Project':
      case 'Collaboration':
        return colors.projectColor;
      case 'Garment':
        return colors.garmentColor;
    }
  };

  return (
    <Container asChild type="index">
      <StaggerIndexList className="mx-auto flex w-full flex-col">
        <ul
          className={clsx(
            'flex w-full flex-1 flex-col justify-between text-left',
          )}
        >
          <li className="hidden grid-cols-3 opacity-0 md:grid md:grid-cols-12">
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <div
                      key={header.id}
                      className={clsx(
                        COLUMN_SIZES[index],
                        'border-b',
                      )}
                    >
                      <Typography type="index" size="md">
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none flex gap-1 items-center h-[1.2em]'
                                : '',
                              onClick:
                                header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: <ArrowUpIcon />,
                              desc: <ArrowDownIcon />,
                            }[
                              header.column.getIsSorted() as string
                            ] ?? null}
                          </button>
                        )}
                      </Typography>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </li>
          <>
            {table
              .getRowModel()
              .rows.slice(0, 10000)
              .map((row) => {
                return (
                  <Disclosure key={row.id}>
                    {({open}) => (
                      <li
                        className={clsx(
                          'flex-1 overflow-hidden border-b border-black opacity-0 2xl:border-b',
                        )}
                        key={row.id}
                        style={{
                          color: getRowColor(row),
                        }}
                      >
                        <Disclosure.Button
                          className={clsx(
                            'flex w-full flex-1 grid-cols-3 justify-between overflow-hidden text-left text-black hover:text-inherit active:text-inherit md:grid md:grid-cols-12',

                            open && 'hover:text-black',
                          )}
                        >
                          {row
                            .getVisibleCells()
                            .map((cell, index) => {
                              const year =
                                row.original.year?.split('-')[0];
                              return (
                                <div
                                  className={COLUMN_SIZES[index]}
                                  key={cell.id}
                                >
                                  <Typography type="index" size="md">
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                  </Typography>
                                  <>
                                    {index == 1 && (
                                      <div className="md:hidden">
                                        {row.original.kind && (
                                          <Typography type="index" size="md">
                                            Type: {row.original.kind}
                                          </Typography>
                                        )}
                                        {row.original.category && (
                                          <Typography type="index" size="md">
                                            Category:{' '}
                                            {row.original.category}
                                          </Typography>
                                        )}
                                     
                                        {row.original.year && (
                                          <Typography type="index" size="md">
                                            Year: {year}
                                          </Typography>
                                        )}
                                      </div>
                                    )}
                                  </>
                                </div>
                              );
                            })}
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          <div
                            className={clsx(
                              'flex w-full flex-1 grid-cols-12 justify-between text-left md:grid',
                              'font-index',
                            )}
                          >
                            <div
                              className={clsx(
                                COLUMN_SIZES[0],
                                'hidden md:block',
                              )}
                            ></div>
                            {/* Description */}
                            <div
                              className={clsx(
                                COLUMN_SIZES[1],
                                'text-black',
                              )}
                            >
                              {row.original._type ==
                              'productWithVariant' ? (
                                <Typography type="index" size="md">
                                  <div
                                    className="normal-case text-black"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        row.original.description,
                                    }}
                                  />
                                </Typography>
                              ) : (
                                <Typography type="index" size="md">
                                  <PortableText
                                    blocks={row.original.description}
                                  />
                                </Typography>
                              )}
                            </div>
                            {/* Spacers */}
                            <div className={COLUMN_SIZES[2]}> </div>
                            <div className={COLUMN_SIZES[3]}></div>
                            <div className={COLUMN_SIZES[4]}></div>
                          </div>
                          {/* Images */}
                          <div className="mb-4 mt-2 md:grid md:grid-cols-12">
                            <div className="col-span-1 hidden md:block" />
                            <div data-row={row.original._type} className="md:col-span-11">
                              <IndexImages type={row.original._type} description={row.original.description} item={row.original} title={row.original.title} />
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </li>
                    )}
                  </Disclosure>
                );
              })}
          </>
        </ul>
      </StaggerIndexList>
    </Container>
  );
}

function IndexImages({item, title, type, description}: {item: any; title?: string; type?: string; description?: any}) {
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
          className="relative grid grid-cols-3 md:grid-cols-12"
          title={title}
          type={type}
          closeTo="#"
          description={description}
        />
      );
  }
}

export default function IndexPage() {
  const {page, colors, gids} = useLoaderData<typeof loader>();
  
  return (
    <SanityPreview data={page} query={COMBINED_INDEX_QUERY}>
      {(page) => {
        return (
          <Suspense>
            <Await resolve={gids}>
              {(resolvedGids) => (
                <IndexTable page={page} colors={colors} resolvedGids={resolvedGids} />
              )}
            </Await>
          </Suspense>
        );
      }}
    </SanityPreview>
  );
}
