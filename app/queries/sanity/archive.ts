import groq from 'groq';

import {ARCHIVE_PAGE} from './fragments/pages/archive';

export const ARCHIVE_PAGE_QUERY = groq`
    *[
    _type == 'archive'
    && slug.current == $slug
  ] | order(_updatedAt desc) [0]{
    ${ARCHIVE_PAGE}
  }
`;

export const ARCHIVE_INDEX_PAGE = groq`
    *[_type =="category"]|order(title asc){
      _id,
        title,
    "entries": *[_type == "archive" && references(^._id)]{
      _id,
      title,
      "slug": "/archives/" + slug.current,
    }
  }
`;
