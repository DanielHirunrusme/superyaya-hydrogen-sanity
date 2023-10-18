import groq from 'groq';

import {MODULES} from '../modules';
import {SEO} from '../seo';

export const PROJECT_PAGE = groq`
  title,
    'slug': '/projets/' + slug.current,
    body,
  modules[] {
    ${MODULES}
  },
  ${SEO}
`;
