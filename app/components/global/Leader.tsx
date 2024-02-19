import {useEffect, useRef, useState} from 'react';

interface Props {
  className?: string;
  title: string;
  index: string;
}

export default function Leader(props: Props) {
  const {className, title, index} = props;
  const spaceRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const dummyTitleRef = useRef<HTMLSpanElement>(null);
  // const [newTitleWidth, setNewTitleWidth] = useState(0);
  const dummySpaceeRef = useRef<HTMLSpanElement>(null);
  const middleSpaceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const winResize = () => {

      const space = middleSpaceRef.current!.getBoundingClientRect().width;
      const dots = space / dotRef.current!.offsetWidth;
      spaceRef.current!.innerHTML = '.'.repeat(dots + 10);

      console.log('space', space, 'dots', dots)

      // console.log( middleSpaceRef.current!.getBoundingClientRect().width)
    };
    winResize();
    window.addEventListener('resize', winResize);
    return () => {
      window.removeEventListener('resize', winResize);
    };
  }, [spaceRef, dotRef, dummyTitleRef, titleRef, containerRef, indexRef, middleSpaceRef]);

  return (
    <>
      <span
        className="pointer-events-none fixed select-none opacity-0"
        ref={dotRef}
      >
        .
      </span>
      <span
        className="pointer-events-none fixed select-none opacity-0"
        ref={dummyTitleRef}
      >
        {title}
      </span>
      <span
        className="pointer-events-none fixed w-[1.75em] select-none opacity-0"
        ref={dummySpaceeRef}
      />
      <div
        ref={containerRef}
        className="relative flex w-full justify-between  overflow-hidden leading-paragraph hover:opacity-50 active:opacity-50"
      >
        <span
          className="relative z-[1] overflow-hidden text-clip whitespace-nowrap bg-white text-left md:flex-grow-0 pr-[.13em]"
          ref={titleRef}
        >
          {title}
        </span>
        <span ref={middleSpaceRef} className="flex-1 mr-[1.75em]"></span>
        <span
          ref={spaceRef}
          className="absolute right-[1.75em] flex flex-1 overflow-hidden whitespace-nowrap"
        ></span>
        <span
          ref={indexRef}
          className="z-1 absolute right-0 flex-grow-0 bg-white"
        >
          {index}
        </span>
      </div>
    </>
  );
}
