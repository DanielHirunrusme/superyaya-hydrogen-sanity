import {useAnimate, stagger, useInView} from 'framer-motion';
import {useEffect} from 'react';
import {STAGGER_SPEED} from '~/lib/constants';
import {useTheme} from '../context/ThemeProvider';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function StaggerIndexList(props: Props) {
  const {children, className} = props;
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  const [theme, setTheme, navVisible] = useTheme();
  useEffect(() => {
    if (!isInView || !navVisible) return;
    const sequence = [
      ['ul li', {opacity: 1}, {delay: stagger(STAGGER_SPEED), duration: 0.01}],
    ];
    animate(sequence);
  }, [isInView, navVisible]);

  return (
    <div className={className} ref={scope}>
      {children}
    </div>
  );
}
