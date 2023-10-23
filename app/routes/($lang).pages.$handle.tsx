import {Await, useLoaderData} from '@remix-run/react';
import type {SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {Suspense} from 'react';
import invariant from 'tiny-invariant';

import PageHero from '~/components/heroes/Page';
import PortableText from '~/components/portableText/PortableText';
import type {SanityPage} from '~/lib/sanity';
import {ColorTheme} from '~/lib/theme';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {PAGE_QUERY} from '~/queries/sanity/page';
import {SanityLink} from '~/lib/sanity';
import {Link} from '~/components/Link';

import {useMatches} from '@remix-run/react';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.page?.seo?.title,
  description: data?.page?.seo?.description,
  media: data?.page?.seo?.image,
});

export const handle = {
  seo,
};

export async function loader({params, context}: LoaderArgs) {
  validateLocale({context, params});

  const {handle} = params;
  invariant(handle, 'Missing page handle');

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const page = await context.sanity.query<SanityPage>({
    query: PAGE_QUERY,
    params: {
      slug: handle,
    },
    cache,
  });

  if (!page) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({page, context});

  return defer({page, gids});
}

export default function Page() {
  const [root] = useMatches();

  const layout = root.data?.layout;
  const {assistance} = layout || {};
  const {page, gids} = useLoaderData<typeof loader>();

  const renderLinks = assistance?.links.map((link: SanityLink) => {
    if (link._type === 'linkExternal') {
      return (
        <li className="mb-6" key={link._key}>
          <a
            className="linkTextNavigation"
            href={link.url}
            rel="noreferrer"
            target={link.newWindow ? '_blank' : '_self'}
          >
            {link.title}
          </a>
        </li>
      );
    }
    if (link._type === 'linkInternal') {
      if (!link.slug) {
        return null;
      }

      return (
        <li key={link._key}>
          <Link
            className="linkTextNavigation linkTextNavigationPage"
            to={link.slug}
          >
            {link.title}
          </Link>
        </li>
      );
    }
    return null;
  });

  return (
    <ColorTheme value={page.colorTheme}>
      <Suspense>
        <Await resolve={gids}>
          {/* Page hero */}
          {/* <PageHero fallbackTitle={page.title} hero={page.hero} /> */}
          <div
            className={clsx(
              'mx-auto w-full max-w-[660px] pb-24 font-body text-xxs 2xl:max-w-desktopRte',
            )}
          >
            {page.displayAssistanceMenu && assistance && (
              <ol className="rte mb-6 flex flex-col !uppercase list-alpha list-inside">
                {renderLinks}
              </ol>
            )}

            {/* Body */}
            {page.body && <PortableText blocks={page.body} centered />}
          </div>
        </Await>
      </Suspense>
    </ColorTheme>
  );
}
