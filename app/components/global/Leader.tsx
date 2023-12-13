import {useEffect, useRef} from 'react';

interface Props {
  className?: string;
  title: string;
  index: string;
}

export default function Leader(props: Props) {
  const {className, title, index} = props;
  const spaceRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const winReisze = () => {
      console.log(spaceRef.current?.offsetWidth, dotRef.current?.offsetWidth);
      const dots = spaceRef.current?.offsetWidth
        ? Math.floor(
            spaceRef.current?.offsetWidth /
              Math.floor(dotRef.current?.offsetWidth),
          )
        : 0;
      spaceRef.current!.innerHTML = '.'.repeat(dots + 15);
    };
    winReisze();
    window.addEventListener('resize', winReisze);
    return () => {
      window.removeEventListener('resize', winReisze);
    };
  }, [spaceRef, dotRef]);

  return (
    <>
      <span
        className="pointer-events-none fixed select-none opacity-0"
        ref={dotRef}
      >
        .
      </span>
      <div className="relative flex w-full justify-between  overflow-hidden leading-paragraph hover:opacity-50 active:opacity-50">
        <span
          className="overflow-hidden text-clip whitespace-nowrap md:flex-grow-0"
          style={{maxWidth: 'calc(100% - 3em)'}}
        >
          {title}
        </span>
        <span
          ref={spaceRef}
          className="flex flex-1 overflow-hidden whitespace-nowrap"
        ></span>
        <span className="z-1 absolute right-0 flex-grow-0 bg-white pl-[1px]">
          {index}
        </span>
      </div>
    </>
  );
}
