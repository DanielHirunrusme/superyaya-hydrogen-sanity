import groq from 'groq';

import {IMAGE} from '../image';
import {PRODUCT_WITH_VARIANT} from '../productWithVariant';

export const MODULE_IMAGE_COLLECTION = groq`
  image {
    ${IMAGE}
  },
  caption,
  layout,
  reference->{
    _key,
      ...${PRODUCT_WITH_VARIANT}
  },
`;
