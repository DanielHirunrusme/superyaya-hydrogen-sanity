import groq from 'groq';

import {MODULES} from '../modules';
import {SEO} from '../seo';

export const ARCHIVE_PAGE = groq`
  title,
    'slug': '/archives/' + slug.current,
    body,
    category->{title, "slug": slug.current},
  modules[] {
    ${MODULES}
  },
  ${SEO}
`;
