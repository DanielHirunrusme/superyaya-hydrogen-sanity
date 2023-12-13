import clsx from 'clsx';
import {Typography} from '../global/Typography';
import PlayIcon from '../icons/Play';
import VolumeIcon from '../icons/Volume';
import {RADIO_PLAYER, SITE_MARGINS_X} from '~/lib/constants';
import {motion} from 'framer-motion';
import {useEffect, useRef, useState} from 'react';
import {useMatches} from '@remix-run/react';
import MuxPlayer from '@mux/mux-player-react';
import PauseIcon from '../icons/Pause';
import VolumeMuteIcon from '../icons/VolumeMute';

type Props = {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
};

export default function RadioPlayer(props: Props) {
  const {isPlaying, setIsPlaying} = props;
  const [blur, setBlur] = useState(false);
  const [ww, setWw] = useState(0);
  const [wh, setWh] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const muxPlayerRef = useRef();
  const [paused, setPaused] = useState(false); // [1
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState({
    currentTime: '00:00:00',
    currentTimeRaw: 0,
    timeRemaining: '00:00:00',
    duration: '00:00:00',
  });
  const [root] = useMatches();
  const [dragConstraints, setDragConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  useEffect(() => {
    const winClick = () => {
      setBlur(true);
    };
    const winResize = () => {
      if (window.innerWidth > 768) {
        setDragConstraints({
          top:
            -window.innerHeight +
            document.getElementById('RadioPlayer')?.getBoundingClientRect()
              .height +
            150,
          left:
            -window.innerWidth +
            document.getElementById('RadioPlayer')?.getBoundingClientRect()
              .width,
          right: 0,
          bottom: 0,
        });
      } else {
        setDragConstraints({
          top:
            -window.innerHeight +
            document.getElementById('RadioPlayer')?.getBoundingClientRect()
              .height +
            250,
          left: -window.innerWidth / 2,
          right: 0,
          bottom: 0,
        });
      }

      setWw(window.innerWidth);
    };
    winResize();
    window.addEventListener('resize', winResize);
    window.addEventListener('click', winClick);
    return () => {
      window.removeEventListener('click', winClick);
      window.removeEventListener('resize', winResize);
    };
  }, []);

  const getTime = (time: number) => {
    var date = new Date(0);
    date.setSeconds(time); // specify value for SECONDS here
    return date.toISOString().substring(11, 19);
  };

  useEffect(() => {
    if (muxPlayerRef.current) {
      muxPlayerRef.current?.addEventListener('ended', () => {
        setPaused(true);
      });

      muxPlayerRef.current?.addEventListener('timeupdate', (e) => {
        setTime({
          currentTime: getTime(muxPlayerRef.current.currentTime),
          currentTimeRaw: muxPlayerRef.current.currentTime,
          timeRemaining: getTime(
            muxPlayerRef.current.duration - muxPlayerRef.current.currentTime,
          ),
          duration: getTime(muxPlayerRef.current.duration),
        });
      });

      setVolume(muxPlayerRef.current?.volume);
    }
  }, [muxPlayerRef, isPlaying]);

  useEffect(() => {
    if (root.data.layout?.radioEpisode?.asset?.data?.duration) {
      setTime({
        currentTime: '00:00:00',
        duration: getTime(root.data.layout.radioEpisode.asset.data.duration),
      });
    }
  }, [root]);

  useEffect(() => {
    !paused ? muxPlayerRef.current?.play() : muxPlayerRef.current?.pause();
  }, [paused]);

  useEffect(() => {
    if (window.innerWidth > 768) {
      setDragConstraints({
        top:
          -window.innerHeight +
          document.getElementById('RadioPlayer')?.getBoundingClientRect()
            .height +
          150,
        left:
          -window.innerWidth +
          document.getElementById('RadioPlayer')?.getBoundingClientRect().width,
        right: 0,
        bottom: 0,
      });
    } else {
      setDragConstraints({
        top:
          -window.innerHeight +
          document.getElementById('RadioPlayer')?.getBoundingClientRect()
            .height +
          100,
        left: -document.getElementById('RadioPlayer')?.getBoundingClientRect()
          .width,
        right: 0,
        bottom: 0,
      });
    }
  }, [blur]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // console.log(muxPlayerRef.current?.volume)
    muxPlayerRef.current?.volume === 0
      ? (muxPlayerRef.current.volume = 1)
      : (muxPlayerRef.current.volume = 0);
  };

  const onPlayerClick = (e) => {
    e.stopPropagation();
    setBlur(false);
  };

  const onMinPlayerClick = (e) => {
    e.stopPropagation();
    setBlur(false);
  };

  const onCanPlay = (e) => {
    setPaused(false);
    muxPlayerRef.current?.play();
  };

  const togglePlay = (e) => {
    setPaused(!paused);
  };

  if (!isPlaying) return null;
  return (
    <>
      <MuxPlayer
        playbackId={root.data.layout.radioEpisode.asset.playbackId}
        ref={muxPlayerRef}
        streamType="on-demand"
        onCanPlay={onCanPlay}
        className="hidden"
      />
      <>
        <>
          {!blur || ww > 768 ? (
            <motion.div
              drag
              style={{touchAction: 'none'}}
              dragMomentum={false}
              dragTransition={{timeConstant: 100000, power: 0.1}}
              id="RadioPlayer"
              onClick={onPlayerClick}
              dragConstraints={dragConstraints}
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
                      <button
                        aria-label="Play"
                        type="button"
                        onClick={togglePlay}
                      >
                        {paused ? <PlayIcon /> : <PauseIcon />}
                      </button>
                      <div className="md:order-0 order-last flex items-center gap-[1em]">
                        <time className="hidden md:order-first md:inline md:w-[6em]">
                          {time.currentTime}
                        </time>
                        <time className="order-last md:order-first md:hidden md:w-[6em]">
                          {time.timeRemaining}
                        </time>
                        <progress
                          className="hidden w-[2em] md:inline md:w-[16em]"
                          value={time.currentTimeRaw}
                          max={
                            root.data.layout?.radioEpisode?.asset?.data
                              ?.duration
                          }
                        />
                        <time className="hidden md:w-[6em]">
                          {time.duration}
                        </time>
                      </div>
                      <div className="flex items-center gap-[1em] md:order-last">
                        <button
                          type="button"
                          onClick={toggleMute}
                          aria-label="Toggle Sound"
                        >
                          {!isMuted ? <VolumeIcon /> : <VolumeMuteIcon />}
                        </button>

                        {/* <input
                      type="range"
                      min={0}
                      max={1}
                      defaultValue={volume}
                      step={0.01}
                      className="volume-range hidden  md:block w-[2em] md:w-[4em]"
                    /> */}
                      </div>
                    </div>
                  </div>
                  <div className="mt-[1em] flex w-full flex-1 items-center justify-center text-center !lowercase md:hidden">
                    <button onClick={() => setIsPlaying(false)}>close</button>
                  </div>
                </Typography>
              </div>
            </motion.div>
          ) : (
            <motion.div
              drag
              id="RadioPlayer"
              style={{touchAction: 'none'}}
              dragMomentum={false}
              dragTransition={{timeConstant: 100000, power: 0.1}}
              dragConstraints={
                !blur ? dragConstraints : {top: 0, left: 0, right: 0, bottom: 0}
              }
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
                      <button
                        aria-label="Play"
                        type="button"
                        onClick={togglePlay}
                      >
                        {paused ? <PlayIcon /> : <PauseIcon />}
                      </button>
                    </div>
                  </div>
                </Typography>
              </div>
            </motion.div>
          )}
        </>
      </>
    </>
  );
}
