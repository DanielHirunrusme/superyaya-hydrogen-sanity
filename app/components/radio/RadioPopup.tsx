import {Image} from '@shopify/hydrogen';
import {useEffect, useRef, useState} from 'react';
import Radio from './Radio';
import {motion, useDragControls} from 'framer-motion';
import clsx from 'clsx';
import RadioPlayer from './RadioPlayer';
import {CAT_SIZE} from '~/lib/constants';
export default function RadioPopup() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timer = useRef();
  const visibleTimer = useRef();
  const [randomPosition, setRandomPosition] = useState({x: 0, y: 0});

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
    window.addEventListener('resize', winResize);
    winResize();
    return () => {
      window.removeEventListener('resize', winResize);
    };
  }, []);
  return (
    <>
      {!isPlaying && (
        <motion.div
          className={clsx(
            'fixed  z-50 outline-none',
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
            touchAction: 'none'
          }}
        >
          <button
            type="button"
            aria-label="Open radio"
            className={clsx('cursor-pointer outline-none', CAT_SIZE)}
            onClick={() => !dragging && setOpen(true)}
          >
            <img
              src="/images/cat-popup.gif"
              width="100%"
              alt="SUPER YAYA Radio"
              style={{mixBlendMode: 'multiply'}}
              className="pointer-events-none"
            />
          </button>
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
