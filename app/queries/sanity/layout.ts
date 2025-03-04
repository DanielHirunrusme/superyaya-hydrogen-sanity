import groq from 'groq';

import {COLOR_THEME} from './fragments/colorTheme';
import {LINKS} from './fragments/links';
import {PORTABLE_TEXT} from './fragments/portableText/portableText';

export const LAYOUT_QUERY = groq`
  *[_type == 'settings'] | order(_updatedAt desc) [0] {
    seo,
    "menuLinks": menu.links[] {
      ${LINKS}
    },
    "radioEpisode": radioEpisode{
      asset->
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
