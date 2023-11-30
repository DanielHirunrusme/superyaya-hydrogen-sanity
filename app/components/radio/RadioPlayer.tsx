import clsx from 'clsx';
import {Typography} from '../global/Typography';
import PlayIcon from '../icons/Play';
import VolumeIcon from '../icons/Volume';
import {RADIO_PLAYER, SITE_MARGINS_X} from '~/lib/constants';
import {motion} from 'framer-motion';
import {useEffect, useState} from 'react';

type Props = {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
};

export default function RadioPlayer(props: Props) {
  const {isPlaying, setIsPlaying} = props;
  const [blur, setBlur] = useState(false);

  useEffect(() => {
    const winClick = () => {
      setBlur(true);
    };
    window.addEventListener('click', winClick);
    return () => {
      window.removeEventListener('click', winClick);
    };
  }, []);

  const onPlayerClick = (e) => {
    e.stopPropagation();
    setBlur(false);
  }

  const onMinPlayerClick = (e) => {
    e.stopPropagation();
    setBlur(false);
  };

  if (isPlaying) {
    if (!blur) {
      return (
        <motion.div
          drag
          style={{touchAction: 'none'}}
          dragMomentum={false}
          dragTransition={{timeConstant: 100000, power: 0.1}}
          id="RadioPlayer"
          onClick={onPlayerClick}
         
          className={clsx(
            'fixed right-0 z-40 w-1/2 text-black md:w-auto',
            RADIO_PLAYER,
            SITE_MARGINS_X,
          )}
        >
          <div
            className={clsx(
              ' rounded-[1.5em] bg-yellow p-[.75em] md:rounded-[.75em] md:p-[.75em]',
            )}
          >
            <Typography type="radioPlayer">
              <div className="flex flex-col gap-[1em]">
                <header className="flex justify-between  gap-[2em] text-center md:mx-0 md:gap-[6em]">
                  <h4>Radio Yaya Episode&nbsp;1</h4>
                  <button
                    className="hidden md:block"
                    onClick={() => setIsPlaying(false)}
                  >
                    Close
                  </button>
                </header>
                <div className="flex items-center gap-[.5em] gap-[1em] md:justify-between">
                  <PlayIcon />
                  <div className="md:order-0 order-last flex items-center gap-[1em]">
                    <time className="hidden md:inline">10:30</time>
                    <progress
                      className="w-[4em] md:w-[16em]"
                      value="30"
                      max="100"
                    />
                    <time>45:30</time>
                  </div>
                  <div className="flex items-center gap-[1em] md:order-last">
                    <VolumeIcon />
                    <progress
                      value="10"
                      max="100"
                      className="hidden w-[2em] md:inline md:w-[4em]"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-[1em] flex w-full flex-1 items-center justify-center text-center !lowercase md:hidden">
                <button onClick={() => setIsPlaying(false)}>close</button>
              </div>
            </Typography>
          </div>
        </motion.div>
      );
    } else {
      return (
        <motion.div
          drag
          id="RadioPlayer"
          style={{touchAction: 'none'}}
          dragMomentum={false}
          dragTransition={{timeConstant: 100000, power: 0.1}}
          onClick={onMinPlayerClick}
          onMouseOver={onMinPlayerClick}
          className={clsx(
            'fixed right-0 z-40 text-black md:w-auto',
            RADIO_PLAYER,
            SITE_MARGINS_X,
          )}
        >
          <div
            className={clsx(
              ' rounded-[1.5em] bg-yellow p-[.75em] md:rounded-[.75em] md:p-[.75em]',
            )}
          >
            <Typography type="radioPlayer">
              <div className="flex flex-col gap-[1em]">
                <div className="flex items-center gap-[.5em] gap-[1em] md:justify-between">
                  <PlayIcon />
                </div>
              </div>
            </Typography>
          </div>
        </motion.div>
      );
    }
  } else {
    return null;
  }
}
