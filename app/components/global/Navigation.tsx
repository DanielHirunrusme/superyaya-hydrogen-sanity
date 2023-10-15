"use client"
import { useCallback, useEffect, useState } from 'react';
import {
  useLocation,
  useNavigation,
} from '@remix-run/react';
import CollectionGroup from '~/components/global/collectionGroup/CollectionGroup';
import { Link } from '~/components/Link';
import type { SanityMenuLink } from '~/lib/sanity';

/**
 * A component that defines the navigation for a web storefront
 */

type Props = {
  menuLinks: SanityMenuLink[];
};

export default function Navigation({ menuLinks }: Props) {
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

        return (
          <div className="flex items-center" key={link._key}>
            <Link className="linkTextNavigation" to={link.slug}>
              {link.title}
            </Link>
          </div>
        );
      }

      return null;
    });
  }, [menuLinks,]);

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

          var hasChildActive = false;

          link.links.map((subLink) => {
            if (location.pathname.includes(subLink.slug)) {
              hasChildActive = true;
            }
          })
          return <div key={`link-${link._key}`}  className={location.pathname.includes(link.slug) || hasChildActive ? 'flex gap-6' : 'hidden'}>
            {link.links.map((subLink) => {
              return (
                <div className="flex items-center" key={subLink._key}>
                  <Link className="linkTextNavigation" to={subLink.slug}>
                    {subLink.title}
                  </Link>
                </div>
              );
            })}
          </div>
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
            if(subLink.links?.length){
              return <div key={`sub-${subLink._key}`} className={location.pathname.includes(subLink.slug) ? 'flex gap-6' : 'hidden'}>
                {subLink.links.map((subSubLink) => {
                  return (
                    <div className="flex items-center" key={subSubLink._key}>
                      <Link className="linkTextNavigation" to={subSubLink.slug}>
                        {subSubLink.title}
                      </Link>
                    </div>
                  );
                })}
              </div>
            }
          })
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
    <nav className="flex flex-col items-center py-4 gap-3 justify-center sticky top-0">
      <Link className="linkTextNavigation" to="/">SUPERYAYA</Link>
      <nav className='hidden md:flex gap-6'>
        {renderLinks()}
      </nav>
      <nav className='hidden md:flex gap-6'>
        {renderSubLinks()}
      </nav>
      <nav className='hidden md:flex gap-6'>
        {renderSubSubLinks()}
      </nav>
    </nav>
  );
}
