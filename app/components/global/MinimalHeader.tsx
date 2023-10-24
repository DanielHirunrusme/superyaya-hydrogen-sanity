import {Link} from '~/components/Link';
import clsx from 'clsx';
import {NAV_GAP_Y, HEADER_TOP} from '~/lib/constants';

export default function MinimalHeader() {
  return (
    <header
      id="Header"
      className={clsx(
        ' absolute flex  w-full flex-col items-center justify-center text-center',
        NAV_GAP_Y,
        HEADER_TOP,
      )}
      role="banner"
    >
      <Link className="linkTextNavigation !no-underline " to="/">
        SUPER YAYA
      </Link>
    </header>
  );
}
