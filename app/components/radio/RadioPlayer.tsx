import clsx from 'clsx';
import {Typography} from '../global/Typography';
import PlayIcon from '../icons/Play';
import VolumeIcon from '../icons/Volume';
import {RADIO_PLAYER, SITE_MARGINS_X} from '~/lib/constants';
import {motion} from 'framer-motion';
import {useCallback, useEffect, useRef, useState} from 'react';
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
  const muxPlayerRef = useRef<any>();
  const [paused, setPaused] = useState(false); // [1
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState({
    currentTime: '00:00:00',
    currentTimeRaw: 0,
    timeRemaining: '00:00:00',
    duration: '00:00:00',
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSeekBarDragging, setIsSeekBarDragging] = useState(false);
  const [seekBarRef, setSeekBarRef] = useState<HTMLDivElement | null>(null);
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
    const date = new Date(0);
    date.setSeconds(time); // specify value for SECONDS here
    return date.toISOString().substring(11, 19);
  };

  useEffect(() => {
    if (muxPlayerRef.current) {
      // Set volume and unmute immediately
      muxPlayerRef.current.volume = 1;
      muxPlayerRef.current.muted = false;
      setVolume(1);
      setIsMuted(false);

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
    }
  }, [muxPlayerRef, isPlaying]);

  useEffect(() => {
    const layout = (root.data as any)?.layout;
    if (layout?.radioEpisode?.video.asset?.data?.duration) {
      setTime({
        currentTime: '00:00:00',
        currentTimeRaw: 0,
        timeRemaining: '00:00:00',
        duration: getTime(layout.radioEpisode.video.asset.data.duration),
      });
    }
  }, [root]);

  useEffect(() => {
    if (muxPlayerRef.current) {
      // Ensure volume is set to 1 when playing
      muxPlayerRef.current.volume = 1;
      !paused ? muxPlayerRef.current?.play() : muxPlayerRef.current?.pause();
    }
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
    // Ensure volume is set before playing
    if (muxPlayerRef.current) {
      muxPlayerRef.current.volume = 1;
      muxPlayerRef.current.muted = false;
    }
    setPaused(false);
    muxPlayerRef.current?.play();
  };

  const onLoadedData = (e) => {
    // Set volume as soon as data is loaded
    if (muxPlayerRef.current) {
      muxPlayerRef.current.volume = 1;
      muxPlayerRef.current.muted = false;
    }
  };

  const togglePlay = (e) => {
    setPaused(!paused);
  };

  const handleSeekBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!seekBarRef || !muxPlayerRef.current) return;
    
    const rect = seekBarRef.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const layout = (root.data as any)?.layout;
    const duration = layout?.radioEpisode?.video?.asset?.data?.duration || 0;
    const newTime = percentage * duration;
    
    muxPlayerRef.current.currentTime = newTime;
    setTime((prev) => ({
      ...prev,
      currentTime: getTime(newTime),
      currentTimeRaw: newTime,
      timeRemaining: getTime(duration - newTime),
    }));
  };

  const handleSeekBarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setIsSeekBarDragging(true);
  };

  const handleSeekBarMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !seekBarRef || !muxPlayerRef.current) return;
    
    const rect = seekBarRef.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
    const layout = (root.data as any)?.layout;
    const duration = layout?.radioEpisode?.video?.asset?.data?.duration || 0;
    const newTime = percentage * duration;
    
    muxPlayerRef.current.currentTime = newTime;
    setTime((prev) => ({
      ...prev,
      currentTime: getTime(newTime),
      currentTimeRaw: newTime,
      timeRemaining: getTime(duration - newTime),
    }));
  }, [isDragging, seekBarRef, root.data]);

  const handleSeekBarMouseUp = () => {
    setIsDragging(false);
    setIsSeekBarDragging(false);
  };

  const handleSeekBarKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!muxPlayerRef.current) return;
    
    const layout = (root.data as any)?.layout;
    const duration = layout?.radioEpisode?.video?.asset?.data?.duration || 0;
    const currentTime = muxPlayerRef.current.currentTime;
    const jumpAmount = duration * 0.05; // 5% of total duration
    
    let newTime = currentTime;
    
    switch (e.key) {
      case 'ArrowLeft':
        newTime = Math.max(0, currentTime - jumpAmount);
        break;
      case 'ArrowRight':
        newTime = Math.min(duration, currentTime + jumpAmount);
        break;
      case 'Home':
        newTime = 0;
        break;
      case 'End':
        newTime = duration;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    muxPlayerRef.current.currentTime = newTime;
    setTime((prev) => ({
      ...prev,
      currentTime: getTime(newTime),
      currentTimeRaw: newTime,
      timeRemaining: getTime(duration - newTime),
    }));
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleSeekBarMouseMove);
      document.addEventListener('mouseup', handleSeekBarMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleSeekBarMouseMove);
      document.removeEventListener('mouseup', handleSeekBarMouseUp);
    };
  }, [isDragging, handleSeekBarMouseMove]);

  // Reset seek bar dragging state when dragging ends
  useEffect(() => {
    if (!isDragging && isSeekBarDragging) {
      setIsSeekBarDragging(false);
    }
  }, [isDragging, isSeekBarDragging]);

  if (!isPlaying) return null;
  return (
    <>
      <MuxPlayer
        playbackId={(root.data as any)?.layout?.radioEpisode?.video?.asset?.playbackId}
        ref={muxPlayerRef}
        streamType="on-demand"
        muted={false}
        volume={1}
        onCanPlay={onCanPlay}
        onLoadedData={onLoadedData}
        className="hidden"
      />
      <>
        <>
          {!blur || ww > 768 ? (
            <motion.div
              drag={!isSeekBarDragging}
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
                <Typography type="radioPlayer" size="md">
                  <div className="flex flex-col gap-[1em]">
                    <header className="flex justify-between  gap-[2em] text-center md:mx-0 md:gap-[6em]">
                      <h4>Radio Yaya {(root.data as any)?.layout?.radioEpisode?.title}</h4>
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
                        <div
                          ref={setSeekBarRef}
                          className="relative hidden h-1 w-[2em] cursor-pointer rounded-full bg-gray-300 md:inline md:w-[16em]"
                          onClick={handleSeekBarClick}
                          onMouseDown={handleSeekBarMouseDown}
                          onMouseEnter={(e) => e.stopPropagation()}
                          onMouseLeave={(e) => e.stopPropagation()}
                          onKeyDown={handleSeekBarKeyDown}
                          role="slider"
                          tabIndex={0}
                          aria-label="Seek audio"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={
                            (root.data as any)?.layout?.radioEpisode?.video?.asset?.data?.duration
                              ? (time.currentTimeRaw / (root.data as any).layout.radioEpisode.video.asset.data.duration) * 100
                              : 0
                          }
                        >
                          <div
                            className="absolute left-0 top-0 h-full rounded-full bg-black"
                            style={{
                              width: `${
                                (root.data as any)?.layout?.radioEpisode?.video?.asset?.data?.duration
                                  ? (time.currentTimeRaw / (root.data as any).layout.radioEpisode.video.asset.data.duration) * 100
                                  : 0
                              }%`,
                            }}
                          />
                          <div
                            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform cursor-grab rounded-full bg-black active:cursor-grabbing"
                            style={{
                              left: `${
                                (root.data as any)?.layout?.radioEpisode?.video?.asset?.data?.duration
                                  ? (time.currentTimeRaw / (root.data as any).layout.radioEpisode.video.asset.data.duration) * 100
                                  : 0
                              }%`,
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsDragging(true);
                              setIsSeekBarDragging(true);
                            }}
                            onMouseEnter={(e) => e.stopPropagation()}
                            onMouseLeave={(e) => e.stopPropagation()}
                          />
                        </div>
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
              drag={!isSeekBarDragging}
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
                <Typography type="radioPlayer" size="md">
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
