import clsx from 'clsx';
import {Typography} from '../global/Typography';
import PlayIcon from '../icons/Play';
import VolumeIcon from '../icons/Volume';
import {RADIO_PLAYER, SITE_MARGINS_X} from '~/lib/constants';
import {motion} from 'framer-motion';

type Props = {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
};

export default function RadioPlayer(props: Props) {
  const {isPlaying, setIsPlaying} = props;
  if (isPlaying) {
    return (
      <motion.div
        drag
        style={{touchAction: 'none'}}
        dragMomentum={false}
        dragTransition={{timeConstant: 100000, power: 0.1}}
        className={clsx('fixed right-0', RADIO_PLAYER, SITE_MARGINS_X)}
      >
        <div className={clsx(' z-50 rounded-[.75em] bg-yellow p-[.75em]')}>
          <Typography type="radioPlayer">
            <div className="flex flex-col gap-[1em]">
              <header className="flex justify-between gap-[6em]">
                <h4>Radio Yaya&nbsp;&nbsp;Episode 1</h4>
                <button onClick={() => setIsPlaying(false)}>Close</button>
              </header>
              <div className="flex items-center gap-[1em]">
                <PlayIcon />
                <time>10:30</time>
                <progress className="w-[16em]" value="30" max="100" />
                <time>45:30</time>
                <VolumeIcon />
                <progress value="10" max="100" className="w-[4em]" />
              </div>
            </div>
          </Typography>
        </div>
      </motion.div>
    );
  } else {
    return null;
  }
}
