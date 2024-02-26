import groq from 'groq';
import {HOME_PAGE} from './fragments/pages/home';

export const PROJECTS_PAGE_QUERY = groq`
  *[_type == 'project'] | order(_updatedAt desc){
    title,
    slug,
    body,
    _id,
    ${HOME_PAGE}
  }
`;

export const PROJECT_PAGE_QUERY = groq`
  *[_type == 'project' && slug.current == $slug] | order(_updatedAt desc){
    title,
    slug,
    body,
    _id,
    ${HOME_PAGE}
  }[0]
`;
