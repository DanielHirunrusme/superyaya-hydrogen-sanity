// Rich text annotations used in the block content editor
import annotationLinkEmail from './annotations/linkEmail'
import annotationLinkExternal from './annotations/linkExternal'
import annotationLinkInternal from './annotations/linkInternal'
import annotationProduct from './annotations/product'

const annotations = [
  annotationLinkEmail,
  annotationLinkExternal,
  annotationLinkInternal,
  annotationProduct,
]

// Document types
import collection from './documents/collection'
import colorTheme from './documents/colorTheme'
import page from './documents/page'
import product from './documents/product'
import productVariant from './documents/productVariant'
import radio from './documents/radio'
import category from './documents/category'
import season from './documents/season'
import archive from './documents/archive'
import route from './documents/route'
import sizeChart from './documents/sizeChart'
import project from './documents/project'

const documents = [
  collection,
  colorTheme,
  page,
  product,
  productVariant,
  radio,
  season,
  // archive,
  category,
  collaboration,
  project,
  sizeChart,
  route,
]

// Singleton document types
import home from './singletons/home'
import settings from './singletons/settings'
import collaboration from './singletons/collaboration'

const singletons = [home, settings]

// Block content
import body from './blocks/body'
import caption from './blocks/caption'

const blocks = [body, caption]

// Object types
import customProductOptionColor from './objects/customProductOption/color'
import customProductOptionColorObject from './objects/customProductOption/colorObject'
import customProductOptionSize from './objects/customProductOption/size'
import customProductOptionSizeObject from './objects/customProductOption/sizeObject'
import footer from './objects/global/footer'
import imageWithProductHotspots from './objects/hotspot/imageWithProductHotspots'
import inventory from './objects/shopify/inventory'
import linkExternal from './objects/global/linkExternal'
import linkInternal from './objects/global/linkInternal'
import links from './objects/global/links'
import notFoundPage from './objects/global/notFoundPage'
import heroCollection from './objects/hero/collection'
import heroHome from './objects/hero/home'
import heroPage from './objects/hero/page'
import moduleAccordion from './objects/module/accordion'
import accordionBody from './objects/module/accordionBody'
import accordionGroup from './objects/module/accordionGroup'
import moduleCallout from './objects/module/callout'
import moduleCallToAction from './objects/module/callToAction'
import moduleCollection from './objects/module/collection'
import moduleGrid from './objects/module/grid'
import gridItems from './objects/module/gridItem'
import menu from './objects/global/menu'
import moduleImage from './objects/module/image'
import moduleImageCollection from './objects/module/imageCollection'
import moduleGallery from './objects/module/gallery'
import moduleImageAction from './objects/module/imageCallToAction'
import moduleImages from './objects/module/images'
import moduleInstagram from './objects/module/instagram'
import moduleProduct from './objects/module/product'
import moduleProducts from './objects/module/products'
import moduleNewsletter from './objects/module/newsletter'
import moduleTable from './objects/module/table'
import moduleTextBlock from './objects/module/textBlock'
import placeholderString from './objects/shopify/placeholderString'
import priceRange from './objects/shopify/priceRange'
import spot from './objects/hotspot/spot'
import productHotspots from './objects/hotspot/productHotspots'
import option from './objects/shopify/option'
import productWithVariant from './objects/shopify/productWithVariant'
import proxyString from './objects/shopify/proxyString'
import seo from './objects/seo/seo'
import seoHome from './objects/seo/home'
import seoPage from './objects/seo/page'
import seoDescription from './objects/seo/description'
import seoShopify from './objects/seo/shopify'
import shopifyCollection from './objects/shopify/shopifyCollection'
import shopifyCollectionRule from './objects/shopify/shopifyCollectionRule'
import shopifyProduct from './objects/shopify/shopifyProduct'
import shopifyProductVariant from './objects/shopify/shopifyProductVariant'
import tableCell from './blocks/tableCell'

// Collections
import collectionGroup from './objects/collection/group'
import collectionLinks from './objects/collection/links'

const objects = [
  customProductOptionColor,
  customProductOptionColorObject,
  customProductOptionSize,
  customProductOptionSizeObject,
  footer,
  imageWithProductHotspots,
  inventory,
  links,
  linkExternal,
  linkInternal,
  notFoundPage,
  heroCollection,
  heroHome,
  heroPage,
  moduleAccordion,
  accordionBody,
  accordionGroup,
  menu,
  moduleCallout,
  moduleCallToAction,
  moduleCollection,
  moduleGrid,
  gridItems,
  moduleImage,
  moduleImageCollection,
  moduleGallery,
  moduleImageAction,
  moduleImages,
  moduleInstagram,
  moduleProduct,
  moduleProducts,
  moduleNewsletter,
  moduleTable,
  moduleTextBlock,
  placeholderString,
  priceRange,
  spot,
  productHotspots,
  option,
  productWithVariant,
  proxyString,
  seo,
  seoHome,
  seoPage,
  seoDescription,
  seoShopify,
  shopifyCollection,
  shopifyCollectionRule,
  shopifyProduct,
  shopifyProductVariant,
  collectionGroup,
  collectionLinks,
  tableCell
]

export const schemaTypes = [...annotations, ...singletons, ...objects, ...blocks, ...documents]
