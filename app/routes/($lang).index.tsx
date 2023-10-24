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
  'md:w-20 2xl:w-[8.75rem] flex-grow-0 text-left ml-2 2xl:ml-4 py-1 uppercase flex gap-1',
  'flex-1 text-left py-1 overflow-hidden uppercase flex gap-1',
  'hidden md:flex w-48 2xl:w-[19.625rem] flex-grow-0 text-left py-1 uppercase gap-1',
  'hidden md:flex w-32 2xl:w-[14rem] flex-grow-0 text-left py-1 uppercase gap-1',
  'hidden md:flex w-16 2xl:w-[4.5rem] flex-grow-0 text-left mr-2 2xl:mr-4 py-1 uppercase gap-1',
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
        accessorKey: 'category',
        header: 'Category',
      },
      {
        accessorKey: 'kind',
        header: 'Kind',
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
              <StaggerIndexList className="mx-auto flex w-full max-w-[1160px] flex-col 2xl:max-w-[72.77vw]">
                <div>
                  <ul
                    className={clsx(
                      'hidden w-full flex-1 justify-between text-left md:flex',
                      GRID_GAP,
                    )}
                  >
                    {table.getHeaderGroups().map((headerGroup) => (
                      <React.Fragment key={headerGroup.id}>
                        {headerGroup.headers.map((header, index) => {
                          return (
                            <li key={header.id} className={COLUMN_SIZES[index]}>
                              <div>
                                {header.isPlaceholder ? null : (
                                  <div
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
                                    }[header.column.getIsSorted() as string] ??
                                      null}
                                  </div>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </ul>
                  <ul>
                    {table
                      .getRowModel()
                      .rows.slice(0, 10000)
                      .map((row) => {
                        return (
                          <Disclosure key={row.id}>
                            {({open}) => (
                              <li
                                className="flex-1 overflow-hidden border-b-[.8px] opacity-0 2xl:border-b"
                                key={row.id}
                              >
                                <Disclosure.Button
                                  className={clsx(
                                    'flex w-full flex-1 justify-between overflow-hidden text-left',
                                    GRID_GAP,
                                    !open && ' hover:opacity-50',
                                    'font-body',
                                  )}
                                >
                                  {row.getVisibleCells().map((cell, index) => {
                                    const year =
                                      row.original.year?.split('-')[0];
                                    return (
                                      <div
                                        className={COLUMN_SIZES[index]}
                                        key={cell.id}
                                      >
                                        {flexRender(
                                          cell.column.columnDef.cell,
                                          cell.getContext(),
                                        )}
                                        <>
                                          {index == 1 && open && (
                                            <div className="md:hidden">
                                              {row.original.kind && (
                                                <div>
                                                  Kind: {row.original.kind}
                                                </div>
                                              )}
                                              {row.original.category && (
                                                <div>
                                                  Category:{' '}
                                                  {row.original.category}
                                                </div>
                                              )}
                                              {row.original.year && (
                                                <div>Year: {year}</div>
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
                                      GRID_GAP,
                                      'font-body text-xxs',
                                    )}
                                  >
                                    <div
                                      className={clsx(
                                        COLUMN_SIZES[0],
                                        'hidden md:block',
                                      )}
                                    ></div>
                                    <div className={COLUMN_SIZES[1]}>
                                      {row.original._type ==
                                      'productWithVariant' ? (
                                        <div>
                                          <div
                                            className="rte body"
                                            dangerouslySetInnerHTML={{
                                              __html: row.original.description,
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <div>
                                          <PortableText
                                            blocks={row.original.description}
                                            className="body"
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <div className={COLUMN_SIZES[2]}> </div>
                                    <div className={COLUMN_SIZES[3]}></div>
                                    <div className={COLUMN_SIZES[4]}></div>
                                  </div>
                                  <div className="mb-4 mt-2 md:ml-22">
                                    <IndexImages item={row.original} />
                                  </div>
                                </Disclosure.Panel>
                              </li>
                            )}
                          </Disclosure>
                        );
                      })}
                  </ul>
                </div>
                {/* <ul className="w-full ">
                <li className="border-b-[.8px]  font-body opacity-0 2xl:border-b">
                  <nav
                    className={clsx(
                      'hidden w-full flex-1 justify-between text-left md:flex',
                      GRID_GAP,
                    )}
                  >
                    <button onClick={onNumClick} className={COLUMN_SIZES[0]}>
                      NO. {getArrow(sortState.id)}
                    </button>
                    <button onClick={onTitleClick} className={COLUMN_SIZES[1]}>
                      Title {getArrow(sortState.title)}
                    </button>
                    <button
                      onClick={onCategoryClick}
                      className={COLUMN_SIZES[2]}
                    >
                      Category {getArrow(sortState.category)}
                    </button>
                    <button onClick={onKindClick} className={COLUMN_SIZES[3]}>
                      Kind {getArrow(sortState.kind)}
                    </button>
                    <button onClick={onYearClick} className={COLUMN_SIZES[4]}>
                      Year {getArrow(sortState.year)}
                    </button>
                  </nav>
                </li>

                {sortedData?.map((item, index) => {
                  const year = item.year?.split('-')[0];
                  return (
                    <Disclosure key={item._id}>
                      {({open}) => (
                        <li
                          className="flex-1 overflow-hidden border-b-[.8px] opacity-0 2xl:border-b"
                          tabIndex={index}
                        >
                          <Disclosure.Button
                            className={clsx(
                              'flex w-full flex-1 justify-between overflow-hidden text-left',
                              GRID_GAP,
                              !open && ' hover:opacity-50',
                              'font-body',
                            )}
                          >
                            <div className={COLUMN_SIZES[0]}>
                              {String(item.id).padStart(3, '0')}
                            </div>
                            <div className={COLUMN_SIZES[1]}>
                              <div className=" truncate">{item.title}</div>






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
                                'font-body text-xxs',
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
                                      className="rte body"
                                      dangerouslySetInnerHTML={{
                                        __html: item.description,
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <PortableText
                                      blocks={item.description}
                                      className="body"
                                    />
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
              </ul> */}
              </StaggerIndexList>
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
