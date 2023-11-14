import {Image} from '@shopify/hydrogen';
import {useAnimate} from 'framer-motion';
import {useEffect} from 'react';

export default function RadioCat1() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (scope.current) {
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
      animate(sequence, {repeat: 10000});
    }
  }, [scope]);
  return (
    <ul className="pointer-events-none h-full" ref={scope}>
      <li className="frame-1 opacity-1 absolute h-full w-full">
        <Image
          src="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-1-1.png?v=1698890552"
          width="100%"
        />
      </li>
      <li className="frame-2 absolute h-full w-full opacity-0">
        <Image
          src="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-1-2.png?v=1698890552"
          width="100%"
        />
      </li>
      <li className="frame-3 absolute h-full w-full opacity-0">
        <Image
          src="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-1-3.png?v=1698890552"
          width="100%"
        />
      </li>
      <li className="frame-4 absolute h-full w-full opacity-0">
        <Image
          src="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-1-4.png?v=1698890552"
          width="100%"
        />
      </li>
    </ul>
  );
}
