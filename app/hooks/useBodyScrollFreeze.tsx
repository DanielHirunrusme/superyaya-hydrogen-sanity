import { useEffect, useState } from 'react';


export function useBodyScrollFreeze(shouldFreeze: boolean) {

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {

    if (shouldFreeze) {
      setScrollY(window.scrollY);
      document.body.classList.add('zoomed')
    } else {
      document.body.classList.remove('zoomed')
      window.scrollTo(0, scrollY);
    }

    return () => document.body.classList.remove('zoomed')
  }, [shouldFreeze]);
}
