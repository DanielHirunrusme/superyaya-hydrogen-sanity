import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {SanityPreview} from 'hydrogen-sanity';
import React, {Suspense, useState, useEffect, useMemo} from 'react';
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
  title: data?.page?.seo?.title || 'SUPER YAYA',
  description:
    data?.page?.seo?.description ||
    'A custom storefront powered by Hydrogen and Sanity',
});

export const handle = {
  seo,
};

const COLUMN_SIZES = [
  'md:w-20 2xl:w-[7em] flex-grow-0 text-left pl-2 2xl:pl-4 py-1.5 uppercase flex gap-1',
  'flex-1 text-left py-1.5 overflow-hidden uppercase flex gap-1',
  'hidden md:flex w-48 2xl:w-[19.625rem] flex-grow-0 text-left py-1.5 uppercase gap-1',
  'hidden md:flex w-32 2xl:w-[14rem] flex-grow-0 text-left py-1.5 uppercase gap-1',
  'hidden md:flex w-16 2xl:w-[4.5rem] flex-grow-0 text-left pr-2 2xl:pr-4 py-1.5 uppercase gap-1',
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

export type IndexItem = {
  _type: string;
  no: number;
  title: string;
  description: any;
  category: string;
  kind: string;
  year: string;
};

export default function IndexPage() {
  const {page, gids} = useLoaderData<typeof loader>();
  const [data, setData] = useState([]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo<ColumnDef<IndexItem>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'No.',
        cell: (cell) => {
          return <div>{String(cell.getValue()).padStart(3, '0')}</div>;
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
    if (page) {
      console.log('page:', page);
      const d = page?.map((item: any, index: number) => {
        if (item._type === 'productWithVariant') {
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
  }, [page]);

  return (
    <SanityPreview data={page} query={INDEX_QUERY}>
      {(page) => {
        // console.log('page', page)
        return (
          <Suspense>
            <Await resolve={gids}>
              <Container asChild type="index">
                <StaggerIndexList className="mx-auto flex w-full flex-col">
                  <ul
                    className={clsx(
                      'hidden w-full flex-1 flex-col justify-between text-left md:flex',
                    )}
                  >
                    <li className="flex opacity-0">
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
                                <Typography type="index">
                                  {header.isPlaceholder ? null : (
                                    <button
                                      type="button"
                                      {...{
                                        className: header.column.getCanSort()
                                          ? 'cursor-pointer select-none flex gap-1 items-center'
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
                                  className="flex-1 overflow-hidden border-b opacity-0 2xl:border-b"
                                  key={row.id}
                                >
                                  <Disclosure.Button
                                    className={clsx(
                                      'flex w-full flex-1 justify-between overflow-hidden text-left',

                                      !open && ' hover:opacity-50',
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
                                            <Typography type="index">
                                              {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                              )}
                                            </Typography>
                                            <>
                                              {index == 1 && open && (
                                                <div className="md:hidden">
                                                  {row.original.kind && (
                                                    <Typography type="index">
                                                      Type: {row.original.kind}
                                                    </Typography>
                                                  )}
                                                  {row.original.category && (
                                                    <Typography type="index">
                                                      Category:{' '}
                                                      {row.original.category}
                                                    </Typography>
                                                  )}
                                                  {row.original.year && (
                                                    <Typography type="index">
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
                                        'flex w-full flex-1 justify-between text-left',
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
                                      <div className={COLUMN_SIZES[1]}>
                                        {row.original._type ==
                                        'productWithVariant' ? (
                                          <Typography type="index">
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  row.original.description,
                                              }}
                                            />
                                          </Typography>
                                        ) : (
                                          <Typography type="index">
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
                                    <div className="mb-4 ml-[7em] mt-2">
                                      <IndexImages item={row.original} />
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
            </Await>
          </Suspense>
        );
      }}
    </SanityPreview>
  );
}

function IndexImages({item}: {item: any}) {
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
