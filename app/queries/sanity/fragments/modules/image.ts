import groq from 'groq';

import {IMAGE} from '../image';
import {LINK_EXTERNAL} from '../linkExternal';
import {LINK_INTERNAL} from '../linkInternal';
import {PRODUCT_HOTSPOT} from '../productHotspot';
import {PRODUCT_WITH_VARIANT} from '../productWithVariant';
import {MARK_DEFS} from '../portableText/markDefs';

export const MODULE_IMAGE = groq`
  image {
    ${IMAGE}
  },
  background,
  (addMobileImage) => {
    mobileImage {
      ${IMAGE}
    },
  },
  caption[]{
    ...,
    markDefs[] {
      ${MARK_DEFS}
    }
  },
  layout,
  (variant == 'callToAction') => {
    callToAction {
      "link": links[0] {
        (_type == 'linkExternal') => {
          ${LINK_EXTERNAL}
        },
        (_type == 'linkInternal') => {
          ${LINK_INTERNAL}
        },
      },
      title,
    }
  },
  (variant == 'productHotspots') => {
    productHotspots[] {
      _key,
      ${PRODUCT_HOTSPOT}
    }
  },
  (variant == 'productTags') => {
    productTags[] {
      _key,
      ...${PRODUCT_WITH_VARIANT}
    },
  },
  variant,
`;
