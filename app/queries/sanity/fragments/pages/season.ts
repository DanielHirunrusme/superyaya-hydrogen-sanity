import groq from 'groq';

import {MODULES} from '../modules';
import {SEO} from '../seo';

export const SEASON_PAGE = groq`
  title,
  collection,
    'slug': '/seasons/' + slug.current,
    body,
  modules[] {
    ${MODULES}
  },
  ${SEO}
`;
