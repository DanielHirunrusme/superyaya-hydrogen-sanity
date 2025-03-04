import groq from 'groq';

export const LINK_INTERNAL = groq`
  _key,
  _type,
  title,
  ...reference-> {
    "documentType": _type,
    (_type == "collection") => {
      "slug": "/boutique/" + store.slug.current,
    },
    (_type == "home") => {
      "slug": "/",
    },
    (_type == "route") => {
      "slug": slug.current,
    },
    (_type == "page") => {
      "slug": "/pages/" + slug.current,
    },
    (_type == "product" && store.isEnabled && store.status == "active") => {
      "slug": "/products/" + store.slug.current,
    },
  }
`;
