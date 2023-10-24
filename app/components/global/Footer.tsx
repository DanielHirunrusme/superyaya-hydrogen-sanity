import {useLocation, useMatches} from '@remix-run/react';
import clsx from 'clsx';

import SanityFooter from '~/components/global/SanityFooter';
import LogoIcon from '~/components/icons/Logo';
import {Link} from '~/components/Link';
import PortableText from '~/components/portableText/PortableText';
import { SITE_MARGINS_X, SITE_MARGINS_Y } from '~/lib/constants';
import type {SanityLink} from '~/lib/sanity';

/**
 * A component that specifies the content of the footer on the website
 */
export default function Footer() {
  const [root] = useMatches();
  const location = useLocation();

  const layout = root.data?.layout;
  const {footer} = layout || {};

  const renderLinks = footer?.links?.map((link: SanityLink) => {
    if (link._type === 'linkExternal') {
      return (
        <div className="mb-6" key={link._key}>
          <a
            className="linkTextNavigation"
            href={link.url}
            rel="noreferrer"
            target={link.newWindow ? '_blank' : '_self'}
          >
            {link.title}
          </a>
        </div>
      );
    }
    if (link._type === 'linkInternal') {
      if (!link.slug) {
        return null;
      }

      return (
        <div className="mb-6" key={link._key}>
          <Link className="linkTextNavigation" to={link.slug}>
            {link.title}
          </Link>
        </div>
      );
    }
    return null;
  });

  if (
    !location.pathname.includes('/collections') &&
    !location.pathname.includes('/archives')
  ) {
    return (
      <>
        <Link
          data-await-intro
          to="/"
          className={clsx("linkTextNavigation !no-underline fixed bottom-0 left-0 z-40 flex items-center leading-none", SITE_MARGINS_X, SITE_MARGINS_Y)}
        >
          Abijan
        </Link>
        <Link
          data-await-intro
          to="/"
          className={clsx("linkTextNavigation !no-underline fixed bottom-0 right-0 z-40 flex items-center leading-none", SITE_MARGINS_X, SITE_MARGINS_Y)}
        >
          Beirut
        </Link>
      </>
    );
  } else {
    return <></>;
  }

  return (
    <footer className="-mt-overlap" role="contentinfo">
      {/* AVKA Footer */}
      <div>
        <div>
          <div>{renderLinks}</div>
        </div>
        {/* {footer?.text && (
          <PortableText
            blocks={footer.text}
            className={clsx(
              '', //
              ' ',
            )}
          />
        )} */}
      </div>

      {/* Sanity Footer */}
      {/* <SanityFooter /> */}
    </footer>
  );
}
