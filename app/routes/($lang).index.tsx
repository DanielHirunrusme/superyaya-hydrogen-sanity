import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {SanityPreview} from 'hydrogen-sanity';
import {Suspense, useState, useEffect} from 'react';
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

export default function IndexPage() {
  const {page, gids} = useLoaderData<typeof loader>();
  const [sorting, setSorting] = useState(false);
  const [sort, setSort] = useState('year');
  const [sortedData, setSortedData] = useState([]);
  const [sortedHeader, setSortedHeader] = useState({});
  const [data, setData] = useState([]);
  const [sortState, setSortState] = useState({
    id: 'asc',
    title: '',
    category: '',
    kind: '',
    year: '',
  });

  const getSortState = (key: string) => {
    if (key === 'asc') {
      return 'desc';
    } else {
      return 'asc';
    }
  };

  const onNumClick = () => {
    setSortedData([...sortByIndex(getSortState(sortState.id))]);
    setSortState({
      id: getSortState(sortState.id),
      category: '',
      kind: '',
      title: '',
      year: '',
    });
  };
  const onTitleClick = () => {
    setSortedData([...sortByTitle(getSortState(sortState.title))]);
    setSortState({
      id: '',
      title: getSortState(sortState.title),
      category: '',
      kind: '',
      year: '',
    });
  };
  const onCategoryClick = () => {
    setSortedData([...sortByCategory(getSortState(sortState.category))]);
    setSortState({
      id: '',
      category: getSortState(sortState.category),
      title: '',
      kind: '',
      year: '',
    });
  };
  const onKindClick = () => {
    setSortedData([...sortByKind(getSortState(sortState.kind))]);
    setSortState({
      id: '',
      kind: getSortState(sortState.kind),
      category: '',
      title: '',
      year: '',
    });
  };
  const onYearClick = () => {
    setSortedData([...sortByYear(getSortState(sortState.year))]);
    setSortState({
      id: '',
      year: getSortState(sortState.year),
      category: '',
      title: '',
      kind: '',
    });
  };

  const sortByIndex = (order: 'asc' | 'desc') => {
    const sorted = data.sort((a, b) => {
      if (order === 'asc') {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });

    return sorted;
  };

  const sortByYear = (order: 'asc' | 'desc') => {
    const sorted = data.sort((a, b) => {
      const aYear = a.year?.split('-')[0];
      const bYear = b.year?.split('-')[0];
      if (aYear && bYear) {
        if (order === 'asc') {
          return Number(aYear) - Number(bYear);
        } else {
          return Number(bYear) - Number(aYear);
        }
      }
      return 0;
    });

    return sorted;
  };

  const sortByTitle = (order: 'asc' | 'desc') => {
    const sorted = data.sort((a, b) => {
      if (a.title && b.title) {
        if (order === 'asc') {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      }
      return 0;
    });

    return sorted;
  };

  const sortByCategory = (order: 'asc' | 'desc') => {
    const sorted = data.sort((a, b) => {
      const aCat = a.category;
      const bCat = b.category;
      if (aCat && bCat) {
        if (order === 'asc') {
          return aCat.localeCompare(bCat);
        } else {
          return bCat.localeCompare(aCat);
        }
      }
      return 0;
    });

    return sorted;
  };

  const sortByKind = (order: 'asc' | 'desc') => {
    const sorted = data.sort((a, b) => {
      const aKind = a.kind;
      const bKind = b.kind;
      if (aKind && bKind) {
        if (order === 'asc') {
          return aKind.localeCompare(bKind);
        } else {
          return bKind.localeCompare(aKind);
        }
      }

      return 0;
    });

    return sorted;
  };

  useEffect(() => {
    if (data?.length > 0) {
      console.log('data', data);
      setSortedData(sortByIndex('asc'));
    }
  }, [data]);

  useEffect(() => {
    if (page) {
      console.log('set Data');
      const d = page?.map((item: any, index: number) => {
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
      });
      setData(d);
    }
  }, [page]);

  const getArrow = (key: string) => {
    if (key === 'asc') {
      return <ArrowDownIcon className="h-4 w-4" />;
    } else if (key === 'desc') {
      return <ArrowUpIcon className="h-4 w-4" />;
    } else {
      return <></>;
    }
  };

  return (
    <SanityPreview data={page} query={INDEX_QUERY}>
      {(page) => (
        <Suspense>
          <Await resolve={gids}>
            <StaggerIndexList className="mx-auto flex w-full max-w-[1160px] 2xl:max-w-[72.77vw]">
              <ul className="w-full ">
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
              </ul>
            </StaggerIndexList>
          </Await>
        </Suspense>
      )}
    </SanityPreview>
  );
}

function IndexImages({item}) {
  return <></>;
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
