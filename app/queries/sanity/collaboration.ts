import groq from 'groq';

import {HOME_PAGE} from './fragments/pages/home';

export const COLLABORATION_PAGE_QUERY = groq`
  *[_type == 'collaboration'] | order(_updatedAt desc) [0]{
    ${HOME_PAGE}
  }
`;
