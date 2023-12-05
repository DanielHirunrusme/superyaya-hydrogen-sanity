import {Transition} from '@headlessui/react';
import Button from '../elements/Button';
import {useRef, useState} from 'react';
import {stagger, useAnimate} from 'framer-motion';
import {Typography} from '../global/Typography';
import clsx from 'clsx';
import {CAT_SIZE} from '~/lib/constants';
import RadioCat2 from './RadioCat2';

export default function Radio({open, setOpen, setIsPlaying}) {
  const frame1Ref = useRef(null);
  const frame2Ref = useRef(null);
  const frame3Ref = useRef(null);
  const [rootOpen, setRootOpen] = useState(false);
  const [scope, animate] = useAnimate();
  const timer = useRef();

  const initialClasses =
    'absolute h-screen flex items-center justify-center w-full';

  const afterEnter = () => {
    setRootOpen(true);
    onCatComplete();
  };

  const beforeLeave = () => {
    clearTimeout(timer.current);
    const hideTitles = async () => {
      const sequence = [
        ['.brand', {opacity: 0}, {duration: 0}],
        ['.date', {opacity: 0}, {duration: 0}],
        ['.episode', {opacity: 0}, {duration: 0}],

        [frame3Ref.current, {opacity: 0}],
        [frame2Ref.current, {opacity: 0, at: frame3Ref.current}],
      ];

      await animate(sequence);
    };

    hideTitles();
  };

  const beforeEnter = () => {
    clearTimeout(timer.current);
  };

  const afterLeave = () => {
    setRootOpen(false);
  };

  const onCatComplete = () => {
    /*
     // ['.brand', {opacity: 1}, {duration: 0.001}],
        // ['.brand', {opacity: 0}, {delay: 1, duration: 0.001}],
        // [frame1Ref.current, {opacity: 0}, {at: 1, duration: 0.001}],
        */
    setRootOpen(true);
    const showTitles = async () => {
      const sequence = [
        ['.date', {opacity: 1}, {delay: 0.5, duration: 0.001}],
        ['.brand', {opacity: 1}, {delay: 0.5, duration: 0.001}],
        ['.episode', {opacity: 1}, {delay: 0.5, duration: 0.001}],
        [frame2Ref.current, {opacity: 0}, {delay: 1, duration: 0.001}],
        ['.frame3Ul li', {opacity: 1}, {delay: stagger(0.5), duration: 0.001}],
      ];

      await animate(sequence);
    };

    showTitles().then(() => {
      timer.current = setTimeout(() => {
        setOpen(false);
        setRootOpen(false);
        setIsPlaying(true);
      }, 2000);
    });
  };

  return (
    <Transition
      show={open}
      enter="transition linear duration-1000 transform"
      enterFrom="translate-y-full"
      enterTo="translate-y-0"
      leave="transition-translate-y duration-500"
      leaveFrom="translate-y-0"
      leaveTo="translate-y-full"
      className="fixed bottom-0 left-0 z-50 h-screen w-full bg-yellow text-black"
      afterEnter={afterEnter}
      beforeLeave={beforeLeave}
      afterLeave={afterLeave}
      beforeEnter={beforeEnter}
    >
      <Button
        mode="text"
        className="absolute right-0 top-0 z-50 p-4"
        onClick={() => setOpen(false)}
      >
        <Typography type="body">Close</Typography>
      </Button>
      <Typography type="radio">
        <div ref={scope} className=" bottom-0 h-screen w-full bg-yellow">
          <div className="flex h-full w-full flex-col items-center justify-center">
            {/* Frame 1 */}
            {/* <div
              ref={frame1Ref}
              className={clsx(initialClasses, 'opacity-100')}
              style={{mixBlendMode: 'multiply'}}
            >
              <div className={clsx("relative aspect-square", CAT_SIZE)}>
              {rootOpen && <RadioCat2 onComplete={onCatComplete} />}
              </div>
            </div> */}
            {/* Frame 2 */}
            <div ref={frame2Ref} className={initialClasses}>
              <ul className="frame2Ul my-auto flex h-screen w-full flex-1 flex-col items-center justify-evenly text-center md:h-auto  md:flex-row">
                <li className="date opacity-0">22.10.2023</li>
                <li className="brand opacity-0">Radio Yaya</li>
                <li className="episode opacity-0">Episode 1</li>
              </ul>
            </div>
            {/* Frame 3 */}
            <div ref={frame3Ref} className={initialClasses}>
              <ul className="frame3Ul flex w-full flex-1 flex-col justify-evenly text-center ">
                <li className="opacity-0">
                  <small>with</small>
                  <br />
                  <br />
                </li>
                <li className="opacity-0">ALIM QASIMOV</li>
                <li className="opacity-0">ELMAN</li>
                <li className="opacity-0">MIRI YUSIFFIDAN HUSEYNOVA</li>
                <li className="opacity-0">OKABER</li>
              </ul>
            </div>
          </div>
        </div>
      </Typography>
    </Transition>
  );
}
