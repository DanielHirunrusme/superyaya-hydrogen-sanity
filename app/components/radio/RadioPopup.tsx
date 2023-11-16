import {Image} from '@shopify/hydrogen';
import {useEffect, useRef, useState} from 'react';
import Radio from './Radio';
import {motion, useDragControls} from 'framer-motion';
import clsx from 'clsx';
import RadioPlayer from './RadioPlayer';
import {CAT_SIZE} from '~/lib/constants';
import RadioCat1 from './RadioCat1';
import {useTheme} from '../context/ThemeProvider';
import {throttle} from '~/lib/utils';
export default function RadioPopup() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timer = useRef();
  const visibleTimer = useRef();
  const [randomPosition, setRandomPosition] = useState({x: 0, y: 0});
  const [theme, setTheme, navVisible, setNavVisible] = useTheme();

  const onPointerDown = () => {
    setDragging(true);
  };
  const onPointerUp = () => {
    clearInterval(timer.current);
    timer.current = setTimeout(() => {
      setDragging(false);
    }, 150);
  };

  useEffect(() => {
    const winResize = () => {
      clearTimeout(timer.current);
      setVisible(false);
      setVisibility();
      setRandomPosition({
        x: Math.random() * (window.innerWidth - 200),
        y: Math.random() * (window.innerHeight - 200),
      });
    };

    const setVisibility = () => {
      clearInterval(visibleTimer.current);
      visibleTimer.current = setInterval(() => {
        setVisible(!visible);
      }, Math.random() * 3000 + 3000);
    };

    setVisibility();
    const handleResizedThrottle = throttle(winResize, 1000);
    window.addEventListener('resize', handleResizedThrottle);
    winResize();
    return () => {
      window.removeEventListener('resize', winResize);
    };
  }, []);

  if (!navVisible) return null;

  return (
    <>
      {!isPlaying && (
        <motion.div
          className={clsx(
            'fixed  z-50 text-black outline-none',
            // !visible && 'pointer-events-none opacity-0',
          )}
          data-radio-cat
          drag
          onDragStart={onPointerDown}
          onDragEnd={onPointerUp}
          dragMomentum={false}
          dragTransition={{timeConstant: 100000, power: 0.1}}
          style={{
            mixBlendMode: 'multiply',
            left: randomPosition.x,
            top: randomPosition.y,
            touchAction: 'none',
          }}
        >
          <div
            className={clsx(
              'relative aspect-square outline-none',
              CAT_SIZE,
            )}
          >
            <button
              type="button"
              aria-label="Open radio"
              onClick={() => !dragging && setOpen(true)}
              className=" cursor-pointer absolute left-1/2 top-1/2 z-10 aspect-square w-[35%] -translate-x-1/2 -translate-y-1/2 transform"
            />
            <RadioCat1 />
            {/* <img
              src="/images/cat-popup.gif"
              width="100%"
              alt="SUPER YAYA Radio"
              style={{mixBlendMode: 'multiply'}}
              className="pointer-events-none"
            /> */}
          </div>
        </motion.div>
      )}
      <Radio
        open={open}
        setOpen={setOpen}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
      <RadioPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
    </>
  );
}
