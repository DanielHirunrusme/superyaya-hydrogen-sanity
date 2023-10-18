'use client';
import {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigation} from '@remix-run/react';
import CollectionGroup from '~/components/global/collectionGroup/CollectionGroup';
import {Link} from '~/components/Link';
import type {SanityMenuLink} from '~/lib/sanity';
import clsx from 'clsx';
import {useAnimate, stagger, useInView} from 'framer-motion';
import { STAGGER_SPEED } from '~/lib/constants';

/**
 * A component that defines the navigation for a web storefront
 */

type Props = {
  menuLinks: SanityMenuLink[];
};

export default function Navigation({menuLinks}: Props) {
  const location = useLocation();
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  const renderLinks = useCallback(() => {
    return menuLinks?.map((link) => {
      if (link._type === 'collectionGroup') {
        return <CollectionGroup collectionGroup={link} key={link._key} />;
      }
      if (link._type === 'linkExternal') {
        return (
          <div className="flex items-center" key={link._key}>
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
            if (childLink.slug && location.pathname.includes(childLink.slug)) {
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
          <li className="flex items-center opacity-0" key={link._key}>
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
    });
  }, [menuLinks]);

  const renderSubLinks = useCallback(() => {
    return menuLinks?.map((link) => {
      if (link._type === 'collectionGroup') {
        return <CollectionGroup collectionGroup={link} key={link._key} />;
      }
      if (link._type === 'linkExternal') {
        return (
          <div className="flex items-center" key={link._key}>
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
          let hasChildActive = false;

          link.links.map((subLink) => {
            if (location.pathname.includes(subLink.slug)) {
              hasChildActive = true;
            }
          });
          return (
            <div
              key={`link-${link._key}`}
              className={
                location.pathname.includes(link.slug) || hasChildActive
                  ? 'flex gap-5'
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
                    className="flex items-center opacity-0"
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
            </div>
          );
        }
      }

      return null;
    });
  }, [menuLinks, location]);

  const renderSubSubLinks = useCallback(() => {
    return menuLinks?.map((link) => {
      if (link._type === 'collectionGroup') {
        return <CollectionGroup collectionGroup={link} key={link._key} />;
      }
      if (link._type === 'linkExternal') {
        return (
          <div className="flex items-center" key={link._key}>
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
                <div
                  key={`sub-${subLink._key}`}
                  className={
                    location.pathname.includes(subLink.slug)
                      ? 'flex gap-5'
                      : 'hidden'
                  }
                >
                  {subLink.links.map((subSubLink) => {
                    return (
                      <li
                        className="flex items-center opacity-0"
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
                </div>
              );
            }
          });
        }
      }

      return null;
    });
  }, [menuLinks, location]);

  useEffect(() => {
    const sequence = [
      ['nav ul li', {opacity: 1}, {delay: stagger(STAGGER_SPEED), duration: 0.01}],
      ['nav ul+ul li', {opacity: 1}, {delay: stagger(STAGGER_SPEED), duration: 0.01}],
      ['nav ul+ul li', , {opacity: 1}, {delay: stagger(STAGGER_SPEED), duration: 0.01}],
    ];
    if(!isInView) return;
    animate(sequence);
  }, [isInView]);

  return (
    <nav
      ref={scope}
      className="z-40 flex flex-col items-center justify-center gap-3 pb-4"
    >
      <FramerNav>{renderLinks()}</FramerNav>
      <FramerNav delay={menuLinks.length * 0.05}>{renderSubLinks()}</FramerNav>
      <FramerNav>{renderSubSubLinks()}</FramerNav>
    </nav>
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
    <ul className="hidden gap-5 md:flex 2xl:gap-10" ref={scope}>
      {children}
    </ul>
  );
}
