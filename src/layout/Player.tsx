import { useEffect, useState, useRef } from "react";
import useStore from "@/store";
import usePlayAudio from "@/hooks/usePlayAudio";
import MiniPlayer from "@/components/MiniPlayer";
import { getMusicUrl, parseMusicMeta } from "@/utils/meta";
import { updatePlayQuque } from "@/utils/player";
import FullPlayer from "@/components/FullPlayer";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import "@/styles/playerTransition.css";

const Player = () => {
  const currentMusic = useStore((state) => state.currentMusic);
  const musicInfo = useStore((state) =>
    state.musicMetaMap.get(currentMusic?.sign || ""),
  );
  const history = useStore((state) => state.history);
  const playQueue = useStore((state) => state.playQueue);
  const isShuffle = useStore((state) => state.isShuffle);
  const isRepeat = useStore((state) => state.isRepeat);
  const isLoop = useStore((state) => state.isLoop);

  const setIsShuffle = useStore((state) => state.setIsShuffle);
  const setIsRepeat = useStore((state) => state.setIsRepeat);
  const setIsLoop = useStore((state) => state.setIsLoop);
  const setCurrentMusic = useStore((state) => state.setCurrentMusic);

  const [curPlayer, setCurPlayer] = useState("mini");
  const miniPlayerRef = useRef<HTMLDivElement>(null);
  const fullPlayerRef = useRef<HTMLDivElement>(null);
  const nodeRef = curPlayer === "mini" ? miniPlayerRef : fullPlayerRef;

  const { coverUrl, artist, title } = musicInfo || {};

  // 销毁后清理媒体通知
  useEffect(() => {
    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = null;
        (
          ["play", "pause", "nexttrack", "previoustrack", "seekto"] as const
        ).forEach((eventName) =>
          navigator.mediaSession.setActionHandler(eventName, null),
        );
      }
    };
  }, []);

  // 获取播放音乐的信息
  useEffect(() => {
    parseMusicMeta(currentMusic?.sign, currentMusic?.basename);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMusic?.sign]);

  useEffect(() => {
    updatePlayQuque();
  }, [isShuffle, isLoop]);

  const next = (isEnded?: boolean) => {
    if (useStore.getState().isRepeat && isEnded) {
      return controls.reload();
    }

    const playQueue = useStore.getState().playQueue;

    if (playQueue.length === 0) return;

    const musicIndex = playQueue[0];
    const music = useStore.getState().musicList[musicIndex];

    setCurrentMusic(music, musicIndex);
    updatePlayQuque("next");
  };

  const prev = () => {
    if (history.length === 0) return;

    const musicIndex = history[history.length - 1];
    const music = useStore.getState().musicList[musicIndex];

    setCurrentMusic(music, musicIndex);
  };

  const controls = usePlayAudio(
    getMusicUrl(currentMusic?.basename, currentMusic?.sign, currentMusic?.etag),
    undefined,
    next,
  );

  // 设置媒体通知 https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist,
        artwork: [{ src: coverUrl || "" }],
      });

      navigator.mediaSession.setActionHandler("play", () => controls.play());
      navigator.mediaSession.setActionHandler("pause", () => controls.pause());
      navigator.mediaSession.setActionHandler("nexttrack", () => next());
      navigator.mediaSession.setActionHandler("previoustrack", prev);
      navigator.mediaSession.setActionHandler("seekto", (val) => {
        if (val.seekTime) {
          controls.jump(val.seekTime);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMusic?.sign]);

  const playerInfo = {
    ...controls,
    title: title || currentMusic?.basename,
    artist,
    cover: coverUrl,
    prevDisabled: history.length === 0,
    nextDisabled: playQueue.length === 0,
    next,
    prev,
    isLoop,
    isShuffle,
    isRepeat,
    setIsShuffle,
    setIsRepeat,
    setIsLoop,
    isEmpty: !currentMusic?.sign,
  };

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={curPlayer}
        nodeRef={nodeRef}
        classNames="player"
        addEndListener={(done) =>
          nodeRef.current?.addEventListener("transitionend", done, false)
        }
      >
        <div
          className="h-full w-full fixed pointer-events-none z-30"
          ref={nodeRef}
        >
          {curPlayer === "mini" ? (
            <MiniPlayer
              onChangePlayer={() => setCurPlayer("full")}
              {...playerInfo}
            />
          ) : (
            <FullPlayer
              {...playerInfo}
              onChangePlayer={() => setCurPlayer("mini")}
            />
          )}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default Player;
