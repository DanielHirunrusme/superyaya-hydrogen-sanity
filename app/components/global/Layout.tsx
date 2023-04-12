import Footer from './Footer';
import Header from './Header';

type LayoutProps = {
  backgroundColor?: string;
  children: React.ReactNode;
};

export function Layout({backgroundColor, children}: LayoutProps) {
  return (
    <>
      <div className="absolute top-0 left-0">
        <a
          href="#mainContent"
          className="sr-only p-4 focus:not-sr-only focus:block"
        >
          Skip to content
        </a>
      </div>

      <div
        className="max-w-screen flex min-h-screen flex-col"
        style={{background: backgroundColor}}
      >
        <Header />

        <main className="relative grow" id="mainContent" role="main">
          <div className="mx-auto pb-overlap">{children}</div>
        </main>
      </div>

      <Footer />
    </>
  );
}
