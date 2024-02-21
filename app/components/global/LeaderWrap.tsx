import {useEffect, useRef} from 'react';

interface Props {
  className?: string;
  title: string;
  index: string;
  noWrap?: boolean;
}

export default function LeaderWrap(props: Props) {
  const {className, title, index, noWrap = true} = props;
  const spaceRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const dummyTitleRef = useRef<HTMLSpanElement>(null);
  const dummySpaceeRef = useRef<HTMLSpanElement>(null);
  const middleSpaceRef = useRef<HTMLSpanElement>(null);


  return (
    <>
      <span
        className="pointer-events-none fixed select-none opacity-0"
        ref={dotRef}
      >
        .
      </span>
       
      
      <div
        ref={containerRef}
        className="relative block pr-[2.5em] justify-between  overflow-hidden leading-paragraph hover:opacity-50 active:opacity-50"
      >
        <span
          className="relative z-[1] bg-white inline "
          ref={titleRef}
        >
          {title || 'Figure'}
        </span>
        <span ref={middleSpaceRef} className="flex-1 mr-[1.75em]"></span>
        <span
          ref={spaceRef}
          className="absolute right-[1.75em] flex flex-1 overflow-hidden whitespace-nowrap pointer-events-none bottom-0"
        >............................................................................................................</span>
        <span
          ref={indexRef}
          className="z-1 absolute right-0 flex-grow-0 bg-white bottom-0"
        >
          {index}
        </span>
      </div>
    </>
  );
}
