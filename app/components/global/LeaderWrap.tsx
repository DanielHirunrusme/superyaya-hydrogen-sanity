import { useRef } from 'react';

interface Props {
  className?: string;
  title: string;
  subtitle?: string;
  index: string;
  noWrap?: boolean;
}

export default function LeaderWrap(props: Props) {
  const { title, subtitle, index } = props;
  const spaceRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);

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
        className="relative flex flex-col md:block md:pr-[2.5em] justify-between  overflow-hidden leading-paragraph hover:opacity-50 active:opacity-50"
      >
        <span
          ref={indexRef}
          className="z-1 md:absolute right-0 flex-grow-0 bg-white bottom-0"
        >
          {index}
        </span>
        <span
          className="relative z-[1] bg-white inline text-pretty md:whitespace-nowrap"
          ref={titleRef}
        >
          {title || 'Figure'}<span className='hidden md:inline'>, {subtitle}</span>
        </span>

        {subtitle && <span
          className="relative z-[1] bg-white inline text-pretty md:hidden "
          ref={titleRef}
        >
          {subtitle}
        </span>}

        <span ref={middleSpaceRef} className="flex-1 mr-[1.75em]"></span>
        <span
          ref={spaceRef}
          className="absolute hidden md:block right-[1.75em] flex flex-1 overflow-hidden whitespace-nowrap pointer-events-none bottom-0"
        >............................................................................................................</span>
        
      </div>
    </>
  );
}
