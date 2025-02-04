import Button from '../elements/Button';
import {useState, useCallback, useEffect} from 'react';
import {useMatches} from '@remix-run/react';
import {FramerNav} from '../global/MobileNavigation';
import CloseIcon from '~/components/icons/Close';
import MenuIcon from '~/components/icons/Menu';
import {Link} from '~/components/Link';
import type {SanityMenuLink} from '~/lib/sanity';
import {useLocation, useNavigation} from '@remix-run/react';
import {useAnimate, stagger, useInView} from 'framer-motion';
import {STAGGER_SPEED} from '~/lib/constants';
import clsx from 'clsx';
import {useTheme} from '../context/ThemeProvider';

export default function CollectionBreadcrumb(props) {
  const [root] = useMatches();
  const layout = root.data?.layout;
  const {menuLinks} = layout || {};

  const {collection} = props;

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  const [open, setOpen] = useState(false);

  const { navVisible} = useTheme();

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
                console.log(subLink);
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
                      to={
                        subLink.documentType !== 'route'
                          ? subLink.slug
                          : `/${subLink.slug}`
                      }
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

  const openMenu = () => {
    setOpen(true);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      const sequence = [
        [
          'nav > div ul li',
          {opacity: 1},
          {delay: stagger(STAGGER_SPEED), duration: 0.0},
        ],
        [
          'nav > div + div > ul li',
          {opacity: 1},
          {delay: stagger(STAGGER_SPEED), duration: 0.0},
        ],
        [
          'nav > div + div + div > ul li',
          {opacity: 1},
          {delay: stagger(STAGGER_SPEED), duration: 0.0},
        ],
      ];
      animate(sequence);
    } else {
      //   const sequence = [
      //     ['nav > div ul li', {opacity: 0}],
      //     ['nav > div + div > ul li', {opacity: 0}],
      //     ['nav > div + div + div > ul li', , {opacity: 0}],
      //   ];
      //   animate(sequence);
    }
  }, [isInView, open]);

  if (navVisible) {
    if (!open) {
      return (
        <header className="md:hidden mb-4 text-center">
          <Button onClick={openMenu} mode="text">
            {collection.title.split(':')?.[0]} /{' '}
            {collection.title.split(':')?.[1]}
          </Button>
        </header>
      );
    } else {
      return (
        <header className="md:hidden mb-4 text-center">
          {/* Links */}
          <nav ref={scope} className="flex flex-col gap-4 pb-4">
            {/* <FramerNav>{renderLinks()}</FramerNav> */}
            <FramerNav>{renderSubLinks()}</FramerNav>
            <FramerNav>{renderSubSubLinks()}</FramerNav>
          </nav>

          <Button onClick={closeMenu} mode="text">
            Close
          </Button>
        </header>
      );
    }
  } else {
    return null;
  }
}
