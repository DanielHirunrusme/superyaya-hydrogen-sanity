import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
import Radio from './Radio';
export default function RadioPopup() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-label='Open radio' onClick={()=>setOpen(true)} className="fixed bottom-0 right-0 m-8">
        <img
          src="/images/cat-popup.gif"
          width="200"
          height="200"
          alt="Superyaya Radio"
        />
      </button>
      <Radio open={open} setOpen={setOpen} />
    </>
  );
}
