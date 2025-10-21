import groq from 'groq';

import {COLOR_THEME} from './fragments/colorTheme';
import {LINKS} from './fragments/links';
import {PORTABLE_TEXT} from './fragments/portableText/portableText';
import {SEO} from './fragments/seo';

export const LAYOUT_QUERY = groq`
  *[_type == 'settings'] | order(_updatedAt desc) [0] {
    ${SEO},
    "menuLinks": menu.links[] {
      ${LINKS}
    },
    "radioEpisode": radioEpisode->{
      ...,
      video {
        asset-> {
          ...,
        }
      }
    },
    "introImage": *[_type == "home"][0].introImage.asset->{...,},
    assistance {
      links[] {
        ${LINKS}
      },
    },
    footer {
      links[] {
        ${LINKS}
      },
      text[]{
        ${PORTABLE_TEXT}
      },
    },
    notFoundPage {
      body,
      "collectionGid": collection->store.gid,
      colorTheme->{
        ${COLOR_THEME}
      },
      title
    }
  }
`;
