import clsx from 'clsx';
import {useState, useCallback, useEffect} from 'react';

import CloseIcon from '~/components/icons/Close';
import MenuIcon from '~/components/icons/Menu';
import {Link} from '~/components/Link';
import type {SanityMenuLink} from '~/lib/sanity';
import Button from '../elements/Button';
import {useLocation, useNavigation} from '@remix-run/react';
import {useAnimate, stagger, useInView} from 'framer-motion';
import {STAGGER_SPEED} from '~/lib/constants';

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
                  onClick={() => setOpen(false)}
                >
                  {link.title}
                </Link>
              </li>
            );
          }

          return null;
        })}
        <li>
          <Link onClick={() => setOpen(false)} to="/pages/faq">
            Assistance
          </Link>
        </li>
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
                      onClick={() => setOpen(false)}
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
                          onClick={() => setOpen(false)}
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
      document.body.classList.add('no-scroll');
      const sequence = [
        [
          'nav > div ul li',
          {opacity: 1},
          {delay: stagger(STAGGER_SPEED), duration: 0.01},
        ],
        [
          'nav > div + div > ul li',
          {opacity: 1},
          {delay: stagger(STAGGER_SPEED), duration: 0.01},
        ],
        [
          'nav > div + div + div > ul li',
          {opacity: 1},
          {delay: stagger(STAGGER_SPEED), duration: 0.01},
        ],
      ];
      animate(sequence);
    } else {
      document.body.classList.remove('no-scroll');

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
      <button
        className={clsx(
          'fixed left-0 top-0 py-[5.7153vw] px-mobile md:hidden',
          !open ? 'z-50' : 'z-[99999]',
        )}
        aria-label='Mobile menu'
      >
        {!open ? (
          <div
            onClick={handleOpen}
            className="  aspect-[1.214] w-[4.358vw]"
          >
            <MenuIcon />
          </div>
        ) : (
          <div
            className=" aspect-[1.214] w-[4.358vw]"
            onClick={handleClose}
          >
            <CloseIcon />
          </div>
        )}
      </button>

      <div
        className={clsx(
          open
            ? 'fixed bottom-0 left-0 right-0 top-0 z-[9999] h-full w-full overflow-y-auto bg-white text-black'
            : 'hidden',
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-center pt-mobile">
          <Link className="linkTextNavigation !no-underline" to="/">
            SUPER YAYA
          </Link>
        </header>

        <br />

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

export const FramerNav = ({
  delay = 0,
  children,
}: {
  delay?: number;
  children: React.ReactNode;
}) => {
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
};
