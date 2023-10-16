import groq from 'groq';

import {MODULES} from '../modules';
import {SEO} from '../seo';

export const SEASON_PAGE = groq`
  title,
    'slug': '/seasons/' + slug.current,
    body,
  modules[] {
    ${MODULES}
  },
  ${SEO}
`;
