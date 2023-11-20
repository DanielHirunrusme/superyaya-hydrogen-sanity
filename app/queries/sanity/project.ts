import groq from 'groq';
import {HOME_PAGE} from './fragments/pages/home';

export const PROJECT_PAGE_QUERY = groq`
  *[_type == 'project'] | order(_updatedAt desc){
    title,
    slug,
    _id,
    ${HOME_PAGE}
  }
`;
