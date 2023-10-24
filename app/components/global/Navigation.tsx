'use client';
import {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigation} from '@remix-run/react';
import CollectionGroup from '~/components/global/collectionGroup/CollectionGroup';
import {Link} from '~/components/Link';
import type {SanityMenuLink} from '~/lib/sanity';
import clsx from 'clsx';
import {useAnimate, stagger, useInView} from 'framer-motion';
import {NAV_GAP, NAV_GAP_Y, STAGGER_SPEED} from '~/lib/constants';
import {Theme, useTheme} from '../context/ThemeProvider';
import {motion} from 'framer-motion';

/**
 * A component that defines the navigation for a web storefront
 */

type Props = {
  menuLinks: SanityMenuLink[];
  logoVisible: boolean;
};

const hasSubLinks = (link, location) => {
  let match = false;

  if (link.links?.length) {
    link.links.forEach((childLink) => {
      if (childLink.slug && location.pathname.includes(childLink.slug)) {
        match = true;
      }
      if (childLink.links?.length) {
        childLink.links.forEach((childChildLink) => {
          if (
            childChildLink.slug &&
            location.pathname.includes(childChildLink.slug)
          ) {
            match = true;
          }
        });
      }
    });
  }

  return match;
};

const boxVariant = {
  hidden: {
    // x: '-100vw', //move out of the site
  },
  visible: {
    // x: 0, // bring it back to nrmal
    transition: {
      delay: 0.1,
      duration: 0,
      when: 'beforeChildren', //use this instead of delay
      staggerChildren: STAGGER_SPEED, //apply stagger on the parent tag
    },
  },
};

const listVariant = {
  hidden: {
    // x: -10, //move out of the site
    // opacity: 0,
  },
  visible: {
    // x: 0, // bring it back to nrmal
    opacity: 1,
    duration: 0,
    transition: {
      duration: 0,
    },
  },
};

export default function Navigation({menuLinks, logoVisible}: Props) {
  const location = useLocation();
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  const [
    theme,
    setTheme,
    navVisible,
    setNavVisible,
    plpVisible,
    setPlpVisible,
  ] = useTheme();

  const renderLinks = useCallback(() => {
    if (menuLinks?.length === 0) return null;

    return (
      <ul className={clsx('hidden md:flex', NAV_GAP)}>
        {menuLinks?.map((link) => {
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

            const isActive =
              location.pathname.split('/')[1] == link.slug ||
              hasSubLinks(link, location);
            // let hasChildActive = false;
            // let hasChildChildActive = false;

            // if (link.links?.length) {
            //   link.links.forEach((childLink) => {
            //     if (
            //       childLink.slug &&
            //       location.pathname.includes(childLink.slug)
            //     ) {
            //       hasChildActive = true;
            //     }
            //     if (childLink.links?.length) {
            //       childLink.links.forEach((childChildLink) => {
            //         if (
            //           childChildLink.slug &&
            //           location.pathname.includes(childChildLink.slug)
            //         ) {
            //           hasChildChildActive = true;
            //         }
            //       });
            //     }
            //   });
            // }

            return (
              <li className="flex items-center opacity-0" key={link._key}>
                <Link
                  className={clsx(
                    'linkTextNavigation',
                    isActive && 'linkTextNavigationActive',
                  )}
                  to={link.slug}
                >
                  {link.title}
                </Link>
              </li>
            );
          }
        })}
      </ul>
    );
  }, [menuLinks, location]);

  const renderSubLinks = useCallback(() => {
    if (!menuLinks?.length) return null;
    const hasChildren = menuLinks.findIndex((link) => {
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
          return hasChildActive;
        }
      }
      return null;
    });

    if (hasChildren === 1) {
      return (
        <>
          {menuLinks?.map((link) => {
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
                  <motion.ul
                    key={`link-${link._key}`}
                    className={clsx('hidden md:flex', NAV_GAP)}
                    variants={boxVariant}
                    animate={navVisible ? 'visible' : 'hidden'}
                    initial={!navVisible ? 'hidden' : 'visible'}
                  >
                    {link.links.map((subLink) => {
                      let hasChildChildActive = false;
                      let isActive = location.pathname.includes(subLink.slug);
                      if (subLink.links?.length) {
                        subLink.links.map((subSubLink) => {
                          if (location.pathname.includes(subSubLink.slug)) {
                            hasChildChildActive = true;
                          }
                        });
                      }
                      return (
                        <motion.li
                          variants={listVariant}
                          className="flex items-center opacity-0"
                          key={subLink._key}
                        >
                          <Link
                            className={clsx(
                              'linkTextNavigation',
                              (hasChildChildActive || isActive) &&
                                'linkTextNavigationActive',
                            )}
                            to={subLink.slug}
                          >
                            {subLink.title}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                );
              }
            }

            return null;
          })}
        </>
      );
    } else {
      return <></>;
    }
  }, [menuLinks, location]);

  const renderSubSubLinks = useCallback(() => {
    const hasSubSubLinks = menuLinks.findIndex((link) => {
      if (link._type === 'linkInternal') {
        if (!link.slug) {
          return null;
        }
        if (link.links?.length) {
          let hasChildActive = false;
          let hasChildChildActive = false;
          link.links.map((subLink) => {
            if (location.pathname.includes(subLink.slug)) {
              hasChildActive = true;

              if (subLink.links?.length) {
                subLink.links.map((subSubLink) => {
                  if (location.pathname.includes(subSubLink.slug)) {
                    hasChildChildActive = true;
                  }
                });
              }
            }
          });
          return hasChildChildActive;
        }
      }
      return null;
    });

    if (hasSubSubLinks === 1) {
      return (
        <>
          {menuLinks?.map((link) => {
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
                  if (
                    subLink.links?.length &&
                    location.pathname.includes(subLink.slug)
                  ) {
                    return (
                      <motion.ul
                        key={`sub-${subLink._key}`}
                        className={clsx('hidden md:flex', NAV_GAP)}
                        variants={boxVariant}
                        animate={navVisible ? 'visible' : 'hidden'}
                        initial={!navVisible ? 'hidden' : 'visible'}
                      >
                        {subLink.links.map((subSubLink) => {
                          return (
                            <motion.li
                              variants={listVariant}
                              className="flex items-center opacity-0"
                              key={subSubLink._key}
                            >
                              <Link
                                className="linkTextNavigation"
                                to={subSubLink.slug}
                              >
                                {subSubLink.title}
                              </Link>
                            </motion.li>
                          );
                        })}
                      </motion.ul>
                    );
                  }
                });
              }
            }

            return null;
          })}
        </>
      );
    } else {
      return <></>;
    }
  }, [menuLinks, location]);

  useEffect(() => {
    const showNav = async () => {
      const sequence = [
        [
          'nav ul li',
          {opacity: 1},
          {delay: stagger(STAGGER_SPEED), duration: 0.01},
        ],
      ];
      await animate(sequence).then(() => {
        setNavVisible(true);
      });
    };

    if (!navVisible) {
      if (isInView && logoVisible) {
        showNav();
      }
    }
  }, [isInView, logoVisible, location, navVisible]);

  return (
    <nav
      ref={scope}
      className={clsx(
        'z-40 flex flex-col items-center justify-center',
        NAV_GAP_Y,
      )}
    >
      <>{renderLinks()}</>
      <>{renderSubLinks()}</>
      <>{renderSubSubLinks()}</>
    </nav>
  );
}
