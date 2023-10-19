import groq from 'groq';

import {MODULES} from '../modules';
import {SEO} from '../seo';

export const SEASON_PAGE = groq`
  title,
  collection,
  titleSvg,
    'slug': '/seasons/' + slug.current,
    body,
  modules[] {
    ${MODULES}
  },
  ${SEO}
`;
