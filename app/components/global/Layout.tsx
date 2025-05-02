import { usePreviewContext } from 'hydrogen-sanity';

import Footer from '~/components/global/Footer';
import Header from '~/components/global/Header';
import { PreviewBanner } from '~/components/preview/PreviewBanner';
import RadioPopup from '../radio/RadioPopup';
import clsx from 'clsx';
import {
  ASSISTANCE_CONTENT_OFFSET,
  SITE_CONTENT_OFFSET,
  SITE_MARGINS_X,
  SITE_MARGINS_Y,
} from '~/lib/constants';
import { useLocation, useMatches } from '@remix-run/react';
import { Link } from '../Link';

type LayoutProps = {
  backgroundColor?: string;
  children: React.ReactNode;
};

export function Layout({ backgroundColor, children }: LayoutProps) {
  const isPreview = Boolean(usePreviewContext());
  const [root] = useMatches();
  const location = useLocation();
 
  return (
    <>
      <div className="absolute left-0 top-0">
        <a
          href="#mainContent"
          className="sr-only p-4 focus:not-sr-only focus:block"
        >
          Skip to content
        </a>
      </div>

      <div
        className="max-w-screen flex min-h-screen flex-col flex-col"
        style={{ background: backgroundColor }}
      >
        <Header />

        <main
          id="mainContent"
          role="main"
          className={clsx(
            'flex grow flex-col relative',
            root?.data?.layout?.assistance?.links.some(
              (e) => e.slug === location.pathname,
            )
              ? ASSISTANCE_CONTENT_OFFSET
              : SITE_CONTENT_OFFSET,
            SITE_MARGINS_X,
          )}
        >
          <div className="mx-auto flex w-full flex-1 flex-col">{children}
            {location.pathname?.includes("/boutique") && <Link
              className={clsx("linkTextNavigation !no-underline absolute bottom-0 transform left-1/2 -translate-x-1/2 z-10", SITE_MARGINS_Y)}
              to="/"
            >
              SUPER YAYA
            </Link>}
          </div>
        </main>
      </div>

      <RadioPopup />

      <Footer />

      {isPreview ? <PreviewBanner /> : <></>}
    </>
  );
}
