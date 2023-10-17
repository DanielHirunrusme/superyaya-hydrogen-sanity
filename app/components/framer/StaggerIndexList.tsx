import {useAnimate, stagger, useInView} from 'framer-motion';
import {useEffect} from 'react';

type Props = {
    children: React.ReactNode;
    className?: string;
};

export default function StaggerIndexList(props: Props) {
    const {children, className} = props;
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    const sequence = [
      ['ul li', {opacity: 1}, {delay: stagger(0.025), duration: 0.01}],
    ];
    if (!isInView) return;
    animate(sequence);
  }, [isInView]);

  return <div className={className} ref={scope}>{children}</div>;
}
