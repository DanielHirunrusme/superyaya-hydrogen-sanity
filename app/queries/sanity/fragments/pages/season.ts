import groq from 'groq';

import {MODULES} from '../modules';
import {SEO} from '../seo';

export const SEASON_PAGE = groq`
  title,
  collection,
  "preOrder": preOrder->{
    "slug": "/boutique/" + store.slug.current,
  },
  titleSvg,
    'slug': '/collections/' + slug.current,
    body,
  modules[] {
    ${MODULES}
  },
  ${SEO}
`;
