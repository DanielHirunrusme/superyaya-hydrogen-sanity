import {
  PRODUCT_FIELDS,
  PRODUCT_VARIANT_FIELDS,
} from '~/queries/shopify/product';

export const COLLECTION_FIELDS = `
  fragment CollectionFields on Collection {
    id
    title
    description
    handle
    startDate: metafield(namespace: "descriptors", key: "start_date") {
      id
      value
    }
    endDate: metafield(namespace: "descriptors", key: "end_date") {
      id
      value
    }
    message: metafield(namespace: "descriptors", key: "message") {
      id
      value
    }
    products(first: $count, after: $cursor, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...ProductFields
        variants(first: 1) {
          nodes {
            ...ProductVariantFields
          }
        }
      }
    }
  }
`;

export const COLLECTION_QUERY = `#graphql
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}
  ${COLLECTION_FIELDS}

  query CollectionDetails($country: CountryCode, $language: LanguageCode, $handle: String!, $count: Int!, $cursor: String, $sortKey: ProductCollectionSortKeys, $reverse: Boolean)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ...CollectionFields
    }
  }
`;

export const COLLECTION_QUERY_ID = `#graphql
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}
  ${COLLECTION_FIELDS}

  query CollectionDetails($country: CountryCode, $language: LanguageCode, $id: ID!, $count: Int!, $cursor: String, $sortKey: ProductCollectionSortKeys, $reverse: Boolean)
    @inContext(country: $country, language: $language) {
    collection(id: $id) {
      ...CollectionFields
    }
  }
`;
