import groq from 'groq';

import {SEASON_PAGE} from './fragments/pages/season';

export const SEASON_PAGE_QUERY = groq`
  *[_type == 'season' && slug.current == $slug
  ] | order(_updatedAt desc) [0]{
    ${SEASON_PAGE}
  }
`;

export const SEASON_INDEX_PAGE = groq`
    *[_type == 'season'] | order(orderRank) {
        ${SEASON_PAGE}
    }
`;
