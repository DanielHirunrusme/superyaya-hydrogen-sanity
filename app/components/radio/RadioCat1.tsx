import {Image} from '@shopify/hydrogen';
import clsx from 'clsx';
import {useAnimate} from 'framer-motion';
import {useEffect, useRef, useState} from 'react';
import {CAT_SIZE} from '~/lib/constants';
import {useTheme, Theme} from '../context/ThemeProvider';
import {useLocation} from '@remix-run/react';

export default function RadioCat1() {
  const [scope, animate] = useAnimate();
  const [visible, setVisible] = useState(false);
  const {theme} = useTheme();
  const timer = useRef();
  const location = useLocation();

  useEffect(() => {
    if (scope.current) {
      const animateCat = async () => {
        const sequence = [
          ['.frame-1', {opacity: 1}, {duration: 0.001}],
          ['.frame-1', {opacity: 0}, {duration: 0.001, delay: 1}],
          // frame 2
          ['.frame-2', {opacity: 1}, {duration: 0.001}],
          ['.frame-2', {opacity: 0}, {duration: 0.001, delay: 1}],
          // frame 3
          ['.frame-3', {opacity: 1}, {duration: 0.001}],
          ['.frame-3', {opacity: 0}, {duration: 0.001, delay: 1}],
          // frame 4
          ['.frame-4', {opacity: 1}, {duration: 0.001}],
          ['.frame-4', {opacity: 0}, {duration: 0.001, delay: 1}],
        ];
        await animate(sequence, {repeat: 2000});
      };
      animateCat();
    }
  }, [scope]);

  useEffect(() => {
    // setVisible(false);
    clearTimeout(timer.current);
    setTimeout(() => {
      setVisible(true);
    }, Math.random() * 3000 + 3000);
  }, []);

  if (!visible) return null;

  return (
    <ul
      className={clsx(
        'pointer-events-none absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 transform',
        CAT_SIZE,
      )}
      ref={scope}
    >
      <li className="frame-1 opacity-1 absolute h-full w-full">
        <Image
          src={
            theme !== Theme.DARK
              ? 'https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-1-1.png?v=1698890552'
              : 'https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-1-1-black.png?v=1700170033'
          }
          width="100%"
        />
      </li>
      <li className="frame-2 absolute h-full w-full opacity-0">
        <Image
          src={
            theme !== Theme.DARK
              ? 'https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-1-2.png?v=1698890552'
              : 'https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-1-2-black.png?v=1700170033'
          }
          width="100%"
        />
      </li>
      <li className="frame-3 absolute h-full w-full opacity-0">
        <Image
          src={
            theme !== Theme.DARK
              ? 'https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-1-3.png?v=1698890552'
              : 'https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-1-3-black.png?v=1700170033'
          }
          width="100%"
        />
      </li>
      <li className="frame-4 absolute h-full w-full opacity-0">
        <Image
          src={
            theme !== Theme.DARK
              ? 'https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-1-4.png?v=1698890552'
              : 'https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-1-4-black.png?v=1700170033'
          }
          width="100%"
        />
      </li>
    </ul>
  );
}
