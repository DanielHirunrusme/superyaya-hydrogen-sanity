import groq from 'groq';
import {MODULES} from './fragments/modules';
export const INDEX_QUERY = groq`
  *[(_type == "product" && !store.isDeleted && store.status != "draft") || _type == "season" || _type == "collaboration" || _type == "archive" || _type == "project" && !(_id in path("drafts.**"))] | order(_type asc){
    _type,
    _id,
    // Product
    // Utilizes the fetchGID function in utils.ts
    // _type needs to be productWithVariant to work
    _type == "product"  => {
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
      collection,
      "preOrder": preOrder->{
        "slug": "/boutique/" + store.slug.current,
      },
      titleSvg,
      'slug': '/collections/' + slug.current,
      body,
      modules[] {
        ${MODULES}
      },
    },
    // Collaboration
    _type == "collaboration" => {
      "slug": '/collaborations/' + slug.current,
      title,
      "category": category->title,
      "kind": "Project",
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

export const INDEX_COLOR_QUERY = groq`{
    "collectionColor": *[_type == "colorTheme" && _id == "9fa0e6d8-deb7-4764-b57a-b017ce1d6fdd"][0].text.hex,
    "projectColor": *[_type == "colorTheme" && _id == "4fb4a554-4166-457b-8452-d88bdd652caf"][0].text.hex,
    "objectColor": *[_type == "colorTheme" && _id == "651207d5-7f38-4d50-b576-10e910855512"][0].text.hex,
    "garmentColor": *[_type == "colorTheme" && _id == "96515da1-0108-462e-bd5c-6069b6fa8f62"][0].text.hex
}`;
