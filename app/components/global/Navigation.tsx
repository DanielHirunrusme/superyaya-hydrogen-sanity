'use client';
import {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigation} from '@remix-run/react';
import CollectionGroup from '~/components/global/collectionGroup/CollectionGroup';
import {Link} from '~/components/Link';
import type {SanityMenuLink} from '~/lib/sanity';
import clsx from 'clsx';

/**
 * A component that defines the navigation for a web storefront
 */

type Props = {
  menuLinks: SanityMenuLink[];
};

export default function Navigation({menuLinks}: Props) {
  const location = useLocation();

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
          <div className="flex items-center" key={link._key}>
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
          </div>
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
                  ? 'flex gap-6'
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
                  <div className="flex items-center" key={subLink._key}>
                    <Link
                      className={clsx(
                        'linkTextNavigation',
                        hasChildChildActive && 'linkTextNavigationActive',
                      )}
                      to={subLink.slug}
                    >
                      {subLink.title}
                    </Link>
                  </div>
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
                      ? 'flex gap-6'
                      : 'hidden'
                  }
                >
                  {subLink.links.map((subSubLink) => {
                    return (
                      <div className="flex items-center" key={subSubLink._key}>
                        <Link
                          className="linkTextNavigation"
                          to={subSubLink.slug}
                        >
                          {subSubLink.title}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              );
            }
          });
          // return <div className={location.pathname.includes(link.slug) ? 'flex gap-6' : 'hidden'}>
          //   {link.links.map((subLink) => {
          //     return (
          //       <div className="flex items-center" key={subLink._key}>
          //         <Link className="linkTextNavigation" to={subLink.slug}>
          //           {subLink.title}
          //         </Link>
          //       </div>
          //     );
          //   })}
          // </div>
        }
      }

      return null;
    });
  }, [menuLinks, location]);

  return (
    <nav className="sticky top-0 flex flex-col items-center justify-center gap-3 py-4">
      <Link className="linkTextNavigation !no-underline" to="/">
        SUPERYAYA
      </Link>
      <nav className="hidden gap-6 md:flex">{renderLinks()}</nav>
      <nav className="hidden gap-6 md:flex">{renderSubLinks()}</nav>
      <nav className="hidden gap-6 md:flex">{renderSubSubLinks()}</nav>
    </nav>
  );
}
