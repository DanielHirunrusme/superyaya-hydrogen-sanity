import {Dialog, Transition} from '@headlessui/react';
import clsx from 'clsx';
import {Fragment, useState, useCallback, useEffect} from 'react';

import {CountrySelector} from '~/components/global/CountrySelector';
import CloseIcon from '~/components/icons/Close';
import MenuIcon from '~/components/icons/Menu';
import {Link} from '~/components/Link';
import type {SanityMenuLink} from '~/lib/sanity';
import Button from '../elements/Button';
import {useLocation, useNavigation} from '@remix-run/react';
import {useAnimate, stagger, useInView} from 'framer-motion';

type Props = {
  menuLinks: SanityMenuLink[];
};

export default function MobileNavigation({menuLinks}: Props) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const location = useLocation();

  const renderLinks = useCallback(() => {
    return (
      <ul>
        {menuLinks?.map((link) => {
          if (link._type === 'linkExternal') {
            return (
              <div
                className="flex flex-col items-center text-center"
                key={link._key}
              >
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

            let hasChildActive = false;
            let hasChildChildActive = false;

            if (link.links?.length) {
              link.links.forEach((childLink) => {
                if (
                  childLink.slug &&
                  location.pathname.includes(childLink.slug)
                ) {
                  hasChildActive = true;
                }
                if (childLink.links?.length) {
                  childLink.links.forEach((childChildLink) => {
                    if (
                      childChildLink.slug &&
                      location.pathname.includes(childChildLink.slug)
                    ) {
                      hasChildChildActive = true;
                    }
                  });
                }
              });
            }

            return (
              <li
                className="flex flex-col items-center text-center opacity-0"
                key={link._key}
              >
                <Link
                  className={clsx(
                    'linkTextNavigation',
                    (hasChildActive || hasChildChildActive) &&
                      'linkTextNavigationActive',
                  )}
                  to={link.slug}
                >
                  {link.title}
                </Link>
              </li>
            );
          }

          return null;
        })}
      </ul>
    );
  }, [menuLinks]);

  const renderSubLinks = useCallback(() => {
    return menuLinks?.map((link) => {
      if (link._type === 'linkExternal') {
        return (
          <li
            className="flex flex-col items-center text-center opacity-0"
            key={link._key}
          >
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

        if (link.links?.length) {
          let hasChildActive = false;

          link.links.map((subLink) => {
            if (location.pathname.includes(subLink.slug)) {
              hasChildActive = true;
            }
          });
          return (
            <ul
              key={`link-${link._key}`}
              className={
                location.pathname.includes(link.slug) || hasChildActive
                  ? 'flex flex-col'
                  : 'hidden'
              }
            >
              {link.links.map((subLink) => {
                let hasChildChildActive = false;
                if (subLink.links?.length) {
                  subLink.links.map((subSubLink) => {
                    if (location.pathname.includes(subSubLink.slug)) {
                      hasChildChildActive = true;
                    }
                  });
                }
                return (
                  <li
                    className="flex flex-col items-center text-center opacity-0"
                    key={subLink._key}
                  >
                    <Link
                      className={clsx(
                        'linkTextNavigation',
                        hasChildChildActive && 'linkTextNavigationActive',
                      )}
                      to={subLink.slug}
                    >
                      {subLink.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          );
        }
      }

      return null;
    });
  }, [menuLinks, location]);

  const renderSubSubLinks = useCallback(() => {
    return menuLinks?.map((link) => {
      if (link._type === 'linkExternal') {
        return (
          <div
            className="flex flex-col items-center text-center"
            key={link._key}
          >
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

        if (link.links?.length) {
          return link.links.map((subLink) => {
            if (subLink.links?.length) {
              return (
                <ul
                  key={`sub-${subLink._key}`}
                  className={
                    location.pathname.includes(subLink.slug)
                      ? 'flex flex-col'
                      : 'hidden'
                  }
                >
                  {subLink.links.map((subSubLink) => {
                    return (
                      <li
                        className="flex flex-col items-center text-center opacity-0"
                        key={subSubLink._key}
                      >
                        <Link
                          className="linkTextNavigation"
                          to={subSubLink.slug}
                        >
                          {subSubLink.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              );
            }
          });
        }
      }

      return null;
    });
  }, [menuLinks, location]);

  useEffect(() => {
    if (open) {
      console.log('animate mobile menu sequence');
      const sequence = [
        [
          'nav > div ul li',
          {opacity: 1},
          {delay: stagger(0.025), duration: 0.01},
        ],
        [
          'nav > div + div > ul li',
          {opacity: 1},
          {delay: stagger(0.025), duration: 0.01},
        ],
        [
          'nav > div + div + div > ul li',
          ,
          {opacity: 1},
          {delay: stagger(0.025), duration: 0.01},
        ],
      ];
      animate(sequence);
    } else {
      const sequence = [
        ['nav > div ul li', {opacity: 0}],
        ['nav > div + div > ul li', {opacity: 0}],
        ['nav > div + div + div > ul li', , {opacity: 0}],
      ];
      animate(sequence);
    }
  }, [isInView, open]);

  return (
    <>
      <button onClick={handleOpen} className="md:hidden">
        Menu
      </button>

      <div
        className={clsx(
          open
            ? 'fixed bottom-0 left-0 right-0 top-0 z-50 h-full w-full overflow-y-auto bg-white pb-40'
            : 'hidden',
        )}
      >
        {/* Header */}
        <header className="flex h-header-sm items-center justify-center">
          <Link className="linkTextNavigation !no-underline" to="/">
            SUPERYAYA
          </Link>
          <Button
            mode="text"
            className=" absolute right-0 px-4"
            onClick={handleClose}
          >
            Close
          </Button>
        </header>

        {/* Links */}
        <nav ref={scope} className="flex flex-col gap-4">
          <FramerNav>{renderLinks()}</FramerNav>
          <FramerNav>{renderSubLinks()}</FramerNav>
          <FramerNav>{renderSubSubLinks()}</FramerNav>
        </nav>
      </div>
    </>
  );
}

function FramerNav({
  delay = 0,
  children,
}: {
  delay?: number;
  children: React.ReactNode;
}) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  // useEffect(() => {
  //   if (isInView) {
  //     animate('li', {opacity: 1}, {delay: stagger(0.05), duration: 0});
  //   }
  // }, [isInView]);
  return (
    <div className="gap-6 text-center" ref={scope}>
      {children}
    </div>
  );
}
