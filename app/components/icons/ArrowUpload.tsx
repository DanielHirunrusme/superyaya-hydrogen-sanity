import {SVGAttributes} from 'react';

export function ArrowUpload(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      style={{width: '.75em'}}
      width="26"
      height="19"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 2L10 16" stroke="black" stroke-width="1.5" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.8694 9.64062L16.9844 8.63718L9.99833 0.87491L3.01229 8.63718L4.12723 9.64062L9.99833 3.11718L15.8694 9.64062ZM0 21.6094L20 21.6094V20.1094L0 20.1094V21.6094Z"
        fill="black"
      />
    </svg>
  );
}
