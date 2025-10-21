import groq from 'groq';
import {MODULES} from './fragments/modules';

export const COMBINED_INDEX_QUERY = groq`
  {
    "products": *[_type == "product" && !store.isDeleted && store.status != "draft" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      "_type": "productWithVariant",
      _id,
      "slug": '/products/' + store.slug.current,
      "title": store.title,
      "category": store.productType,
      "kind": "Garment",
      "year": "2025", // Default year for products
      "description": store.descriptionHtml,
      "gid": store.gid,
      "productWithVariant": store
    },
    "seasons": *[_type == "season" && !(_id in path("drafts.**"))] | order(date desc) {
      _id,
      "slug": '/collections/' + slug.current,
      title,
      "category": collection,
      "kind": "collection",
      "year": date,
      "description": body,
      collection,
      "preOrder": preOrder->{
        "slug": "/boutique/" + store.slug.current,
      },
      titleSvg,
      body,
      modules[] {
        ${MODULES}
      }
    },
    "collaborations": *[_type == "collaboration" && !(_id in path("drafts.**"))] | order(date desc) {
      _id,
      "slug": '/collaborations/' + slug.current,
      title,
      "category": category->title,
      "kind": "Project",
      "year": date,
      "description": body,
      modules[] {
        ${MODULES}
      }
    },
    "projects": *[_type == "project" && !(_id in path("drafts.**"))] | order(year desc) {
      _id,
      "slug": '/projects/' + slug.current,
      title,
      "category": category->title,
      "kind": "Project",
      "year": year,
      "description": body,
      modules[] {
        ${MODULES}
      }
    },
    "archives": *[_type == "archive" && !(_id in path("drafts.**"))] | order(date desc) {
      _id,
      "slug": '/archives/' + slug.current,
      title,
      "category": category->title,
      "kind": "Archive",
      "year": date,
      "description": body,
      modules[] {
        ${MODULES}
      }
    }
  }
`;