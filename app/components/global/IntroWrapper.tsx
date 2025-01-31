import {useLoaderData, useMatches} from '@remix-run/react';
import SanityImage from '../media/SanityImage';
import {motion, useAnimate} from 'framer-motion';
import {useEffect, useState} from 'react';

export default function IntroWrapper(props: any) {
  const [scope, animate] = useAnimate();
  const {children} = props;
  const data = useLoaderData();
  const [root] = useMatches();
  const {sanityDataset, sanityProjectID} = root.data;
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [introDone, setIntroDone] = useState<boolean>(false);

  useEffect(() => {
    const getTargetWidth = () => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const aspectRatio =
        data.layout.introImage.metadata.dimensions.aspectRatio;
      const w = wh * aspectRatio;
      return w;
    };
    const exitAnimation = async () => {
      await animate(scope.current, {opacity: 0}, {duration: 1, delay: 1});
    };
    const safeToRemove = () => {
      setIntroDone(true);
      exitAnimation();
    };

    setTargetWidth(getTargetWidth());
    if (targetWidth > 0) {
      const introAnimation = async () => {
        await animate('div', {opacity: 1}, {duration: 1, delay: 0.5});
        safeToRemove();
      };
      introAnimation();
    }
  }, [targetWidth]);

  return (
    <>
      <div
        ref={scope}
        className="pointer-events-none fixed z-50 h-screen w-full bg-black"
      >
        <div
          style={{
            opacity: 1,
            aspectRatio: data.layout.introImage.metadata.dimensions.aspectRatio,
          }}
          className="absolute left-1/2 top-1/2   w-[112vw]  -translate-x-1/2 -translate-y-1/2 rotate-90 transform md:w-[33.33vw] md:rotate-0 xl:w-[27.546vw] 2xl:w-[27.265vw]"
        >
          <SanityImage
            alt={'SUPER YAYA'}
            dataset={sanityDataset}
            layout="responsive"
            objectFit="contain"
            projectId={sanityProjectID}
            sizes="50vw, 100vw"
            src={data.layout.introImage._id}
          />
        </div>
      </div>
      {introDone && <>{children}</>}
    </>
  );
}
