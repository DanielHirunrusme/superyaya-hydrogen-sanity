export const PRODUCT_VARIANT_FIELDS = `
  fragment ProductVariantFields on ProductVariant {
    availableForSale
    compareAtPrice {
      currencyCode
      amount
    }
    id
    image {
      altText
      height
      id
      url
      width
    }
    price {
      currencyCode
      amount
    }
    selectedOptions {
      name
      value
    }
    title
    sku
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    swatch: metafield(key: "swatch", namespace: "descriptors") {
      id
      value
      type
      reference {
        ... on MediaImage {
          image {
            originalSrc
          }
        }
      }
    }
  }
`;

export const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    handle
    id
    options {
      name
      values
    }
    title
    vendor
    descriptionHtml
    media(first: 20) {
      nodes {
        ... on MediaImage {
          id
          mediaContentType
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    images(first: 20) {
      nodes {
        altText
        height
        id
        url
        width
      }
    }
    washing_instructions: metafield(key: "washing_instructions", namespace: "descriptors") {
      id
      value
    }
    details: metafield(key: "details", namespace: "descriptors") {
      id
      value
    }
    inquire: metafield(key: "inquire", namespace: "descriptors") {
      id
      value
    }
    pre_order: metafield(key: "pre_order", namespace: "descriptors") {
      id
      value
    }
    color_variants: metafield(key: "color_variants", namespace: "descriptors") {
      id
      references(first: 10) { # Adjust the limit as needed
        nodes {
          ... on Metaobject {
            id
            type
            fields {
              key
              value
              reference {
                ... on MediaImage {
                  id
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_QUERY = `#graphql
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query product($country: CountryCode, $language: LanguageCode, $handle: String!, $selectedOptions: [SelectedOptionInput!]!)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductFields
      media(first: 20) {
        nodes {
          ... on MediaImage {
            id
            mediaContentType
            image {
              id
              url
              altText
              width
              height
            }
          }
          ... on Model3d {
            id
            mediaContentType
            sources {
              mimeType
              url
            }
          }
        }
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ...ProductVariantFields
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFields
        }
      }
    }
  }
`;

export const PRODUCTS_AND_VARIANTS = `#graphql
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query products(
    $country: CountryCode
    $language: LanguageCode
    $ids: [ID!]!
    $variantIds: [ID!]!
  ) @inContext(country: $country, language: $language) {
    products: nodes(ids: $ids) {
      ... on Product {
        ...ProductFields
      }
    }
    productVariants: nodes(ids: $variantIds) {
      ... on ProductVariant {
        ...ProductVariantFields
      }
    }
  }
`;

export const PRODUCT_AND_VARIANT = `#graphql
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query product(
    $country: CountryCode
    $language: LanguageCode
    $id: ID!
    $variantId: ID!
  ) @inContext(country: $country, language: $language) {
    product: product(id: $id) {
      ...ProductFields
    }
    productVariant: node(id: $variantId) {
      ... on ProductVariant {
        ...ProductVariantFields
      }
    }
  }
`;

export const PRODUCTS_AND_COLLECTIONS = `#graphql
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query productsAndCollections(
    $country: CountryCode
    $language: LanguageCode
    $ids: [ID!]!
  ) @inContext(country: $country, language: $language) {
    productsAndCollections: nodes(ids: $ids) {
      ... on Product {
        ...ProductFields
        variants(first: 250) {
          nodes {
            ...ProductVariantFields
          }
        }
      }
      ... on Collection {
        id
        title
        description
        handle
      }
    }
  }
`;

export const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANT_FIELDS}

  query variants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      variants(first: 250) {
        nodes {
          ...ProductVariantFields
        }
      }
    }
  }
`;

export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query productRecommendations(
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...ProductFields
      variants(first: 1) {
        nodes {
          ...ProductVariantFields
        }
      }
    }
  }
`;
