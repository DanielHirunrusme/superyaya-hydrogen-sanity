import groq from 'groq';
import {MODULES} from './fragments/modules';
export const INDEX_QUERY = groq`
  *[(_type == "product" && !store.isDeleted) || _type == "season" || _type == "collaboration" || _type == "archive" || _type == "project"] | order(_type asc){
    _type,
    _id,
    // Product
    // Utilizes the fetchGID function in utils.ts
    // _type needs to be productWithVariant to work
    _type == "product" => {
      "_type": "productWithVariant",
      "slug": '/products/' + store.slug.current,
      "title": store.title,
      "category": store.productType,
      "kind": "Garment",
      "year": store.createdAt,
      "description": store.descriptionHtml,
      "gid": store.gid,
      "productWithVariant": store
    },
    // Season
    _type == "season" => {
      "slug": '/collections/' + slug.current,
      title,
      "category": collection,
      "kind": "collection",
      "year": date,
      "description": body,
      modules[] {
        ${MODULES}
      },
    },
    // Collaboration
    _type == "collaboration" => {
      "slug": '/collaborations/' + slug.current,
      title,
      "category": category->title,
      "kind": "Collaboration",
      "year": date,
      "description": body,
      modules[] {
        ${MODULES}
      },
    },
    // Project
     _type == "project" => {
      "slug": '/projects/' + slug.current,
      title,
      "category": category->title,
      "kind": "Project",
      "year": date,
      "description": body,
      modules[] {
        ${MODULES}
      },
    },
    // Archive
    _type == "archive" => {
      "slug": '/archives/' + slug.current,
      title,
      "category": category->title,
      "kind": "Archive",
      "year": date,
      "description": body,
      modules[] {
        ${MODULES}
      },
    }
 
  }
`;
