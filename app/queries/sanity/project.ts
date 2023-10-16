import groq from 'groq';

import {PROJECT_PAGE} from './fragments/pages/project';

export const PROJECT_PAGE_QUERY = groq`
  *[_type == 'project'    && slug.current == $slug
  ] | order(_updatedAt desc) [0]{
    ${PROJECT_PAGE}
  }
`;

export const PROJECT_INDEX_PAGE = groq`
    *[_type == 'project'] | order(date desc) {
        ${PROJECT_PAGE}
    }
`;