import groq from 'groq';
export const INDEX_QUERY = groq`
  *[_type == "product" || _type == "collection" || _type == "season" || _type == "page" || _type == "season" || _type == "archive"] | order(_type asc){
    _type,
    _id,
    // Page
    _type == "page" => {
      "slug": '/pages/' + slug.current,
      title,
      "category": "page",
      "kind": "",
      "year": "",
      "description": ""
    },
    // Product
    // Utilizes the fetchGID function in utils.ts
    // _type needs to be productWithVariant to work
    _type == "product" => {
      "_type": "productWithVariant",
      "slug": '/products/' + store.slug.current,
      "title": store.title,
      "category": "product",
      "kind": store.productType,
      "year": store.createdAt,
      "description": store.descriptionHtml,
      "gid": store.gid,
      "productWithVariant": store
    },
    // Collection
    _type == "collection" => {
      "slug": '/collections/' + store.slug.current,
      "title": store.title,
      "category": "collection",
      "kind": "",
      "year": "",
      "description": store.descriptionHtml

    },
    // Season
    _type == "season" => {
      "slug": '/seasons/' + slug.current,
      title,
      "category": "season",
      "kind": "",
      "year": "",
      "description": ""

    },
    // Archive
    _type == "archive" => {
      "slug": '/archives/' + slug.current,
      title,
      "category": "archive",
      "kind": "",
      "year": "",
      "description": ""

    }
 
  }
`;
