import groq from 'groq';

import {PRODUCT_PAGE} from './fragments/pages/product';

export const PRODUCT_PAGE_QUERY = groq`
  *[
    _type == 'product'
    && store.slug.current == $slug
  ] | order(_updatedAt desc) [0]{
    ${PRODUCT_PAGE}
  }
`;

export const PRODUCT_PAGE_GID_QUERY = groq`
  *[
    _type == 'product'
    && store.gid == $gid
  ] | order(_updatedAt desc) [0]{
    ${PRODUCT_PAGE}
  }
`;


export const SIZE_GUIDE_QUERY = groq`
  {
    "frenchCm": *[_type == 'sizeChart' && slug.current == "french-sizes-cm"][0]{
      title,
      sizeChart,
    },
    "frenchIn": *[_type == 'sizeChart' && slug.current == "french-sizes-in"][0]{
      title,
      sizeChart,
    },
    "international": *[_type == 'sizeChart' && slug.current == "international"][0]{
      title,
      sizeChart,
    },
  }
`;
