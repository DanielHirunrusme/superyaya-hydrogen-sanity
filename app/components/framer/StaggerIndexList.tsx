import {useAnimate, stagger, useInView} from 'framer-motion';
import {useEffect} from 'react';
import {STAGGER_SPEED} from '~/lib/constants';
import {useTheme} from '../context/ThemeProvider';

type Props = {
  children: React.ReactNode;
  className?: string;
  target?: string;
  onComplete?: () => void;
};

export default function StaggerIndexList(props: Props) {
  const {children, className, target = 'ul li', onComplete} = props;
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  const [theme, setTheme, navVisible] = useTheme();
  useEffect(() => {
    if (!isInView || !navVisible) return;
    const staggerIn = async () => {
      const sequence = [
        [target, {opacity: 1}, {delay: stagger(STAGGER_SPEED), duration: 0.01}],
      ];
      await animate(sequence);
      if (onComplete) onComplete();
    };
    staggerIn();
    // const sequence = [
    //   [target, {opacity: 1}, {delay: stagger(STAGGER_SPEED), duration: 0.01}],
    // ];
    // animate(sequence);
  }, [isInView, navVisible]);

  return (
    <div className={className} ref={scope}>
      {children}
    </div>
  );
}
