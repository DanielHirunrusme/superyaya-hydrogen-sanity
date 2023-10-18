import {usePreviewContext} from 'hydrogen-sanity';

import Footer from '~/components/global/Footer';
import Header from '~/components/global/Header';
import {PreviewBanner} from '~/components/preview/PreviewBanner';
import RadioPopup from '../radio/RadioPopup';

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
        className="max-w-screen flex flex-col min-h-screen flex-col"
        style={{background: backgroundColor}}
      >
        <Header />

        <main className="grow mx-4 pb-24 pt-[3.875rem] md:pt-[7.875rem] 2xl:pt-[14rem]" id="mainContent" role="main">
          <div className="mx-auto grow">{children}</div>
        </main>
      </div>

      <RadioPopup />

      <Footer />

      {isPreview ? <PreviewBanner /> : <></>}
    </>
  );
}
