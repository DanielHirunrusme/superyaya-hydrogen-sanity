export const ALL_PRODUCTS_FIELDS = `
  fragment AllProductsFields on Product {
    id
    handle
    title
    productType
    descriptionHtml
    year: metafield(namespace: "custom", key: "year") {
      value
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    variants(first: 1) {
      nodes {
        id
        price {
          amount
          currencyCode
        }
        availableForSale
      }
    }
  }
`;

export const ALL_PRODUCTS_QUERY = `#graphql
  ${ALL_PRODUCTS_FIELDS}
  
  query allProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        ...AllProductsFields
      }
    }
  }
`;
