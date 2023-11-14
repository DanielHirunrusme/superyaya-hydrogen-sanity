import {Image} from '@shopify/hydrogen';
import {useAnimate} from 'framer-motion';
import {useEffect} from 'react';

export default function RadioCat2({onComplete}) {
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
        // frame 5
        ['.frame-5', {opacity: 1}, {duration: 0.001}],
        ['.frame-5', {opacity: 0}, {duration: 0.001, delay: 1}],
        // frame 6
        ['.frame-6', {opacity: 1}, {duration: 0.001}],
        ['.frame-6', {opacity: 0}, {duration: 0.001, delay: 1}],
        // frame 7
        ['.frame-7', {opacity: 1}, {duration: 0.001}],
        // ['.frame-7', {opacity: 0}, {duration: 0.001, delay: 1}],
      ];
      animate(sequence).then(()=> onComplete())
    }
  }, [scope]);
  return (
    <ul className="pointer-events-none  w-full relative h-full" ref={scope} style={{ mixBlendMode: 'multiply'}}>
      <li className="frame-1 opacity-1 absolute h-full w-full">
        <Image
          src="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-2-1.png?v=1698890552"
          width="100%"
        />
      </li>
      <li className="frame-2 absolute h-full w-full opacity-0">
        <Image
          src="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-2-2.png?v=1698890552"
          width="100%"
        />
      </li>
      <li className="frame-3 absolute h-full w-full opacity-0">
        <Image
          src="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-2-3.png?v=1698890552"
          width="100%"
        />
      </li>
      <li className="frame-4 absolute h-full w-full opacity-0">
        <Image
          src="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-2-4.png?v=1698890552"
          width="100%"
        />
      </li>
      <li className="frame-5 absolute h-full w-full opacity-0">
        <Image
          src="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-2-5.png?v=1698890552"
          width="100%"
        />
      </li>
      <li className="frame-6 absolute h-full w-full opacity-0">
        <Image
          src="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-2-6.png?v=1698890552"
          width="100%"
        />
      </li>
      <li className="frame-7 absolute h-full w-full opacity-0">
        <Image
          src="https://cdn.shopify.com/s/files/1/0831/2474/8591/files/cat-2-7.png?v=1698893083"
          width="100%"
        />
      </li>
    </ul>
  );
}
