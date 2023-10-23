import {Link} from '~/components/Link';


export default function MinimalHeader() {
  return (
    <header
      id="Header"
      className="absolute top-0 z-10 flex w-full  flex-col items-center justify-center text-center"
      role="banner"
    >
      <Link className="linkTextNavigation mb-3 mt-4 2xl:mt-7 !no-underline " to="/">
        SUPER YAYA
      </Link>
    </header>
  );
}

