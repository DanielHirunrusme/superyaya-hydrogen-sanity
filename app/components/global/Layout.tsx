import {usePreviewContext} from 'hydrogen-sanity';

import Footer from '~/components/global/Footer';
import Header from '~/components/global/Header';
import {PreviewBanner} from '~/components/preview/PreviewBanner';
import RadioPopup from '../radio/RadioPopup';
import clsx from 'clsx';

type LayoutProps = {
  backgroundColor?: string;
  children: React.ReactNode;
};

export function Layout({backgroundColor, children}: LayoutProps) {
  const isPreview = Boolean(usePreviewContext());

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
        style={{background: backgroundColor}}
      >
        <Header />

        <main
          id="mainContent"
          role="main"
          className={clsx(
            'mx-4 flex grow flex-col pb-24 pt-[3.875rem] md:pt-[7.875rem] 2xl:pt-[14rem]',
          )}
        >
          <div className="mx-auto flex w-full flex-1 flex-col">{children}</div>
        </main>
      </div>

      <RadioPopup />

      <Footer />

      {isPreview ? <PreviewBanner /> : <></>}
    </>
  );
}
