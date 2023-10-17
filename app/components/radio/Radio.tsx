import {Transition} from '@headlessui/react';
import Button from '../elements/Button';

export default function Radio({open, setOpen}) {
  return (
    <Transition
      show={open}
      enter="transition linear duration-1000 transform"
      enterFrom="translate-y-full"
      enterTo="translate-y-0"
      leave="transition-translate-y duration-500"
      leaveFrom="translate-y-0"
      leaveTo="translate-y-full"
      className="absolute bottom-0 left-0 z-50 h-screen w-full bg-yellow"
    >
        <Button mode='text' className='absolute top-0 right-0 p-4' onClick={()=>setOpen(false)}>Close</Button>
      <div className=" bottom-0 h-screen w-full bg-yellow">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="flex w-full flex-1 flex-col justify-evenly text-center font-serif text-2xl md:grow-0 md:flex-row">
            <div>22.10.2023</div>
            <h2>Radio Yaya</h2>
            <div>Episode 1</div>
          </div>
          <img
            src="/images/cat.gif"
            alt="Radio Yaya"
            style={{mixBlendMode: 'multiply'}}
            width="400"
            height="400"
            className="absolute -mb-20"
          />
        </div>
      </div>
    </Transition>
  );
}
