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

export const SIZE_GUIDE_QUERY = groq`
  *[_type == 'sizeChart' && slug.current == "global-desktop"][0]{
    title,
    sizeChart,
  }
`;