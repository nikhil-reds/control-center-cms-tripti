"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../preview.module.css";

type VideoViewerProps = { src: string; playing: boolean };
type LoadState = "loading" | "ready" | "buffering" | "error";

export function VideoViewer({ src, playing }: VideoViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const preparedRef = useRef(false);
  const showingPosterFrameRef = useRef(false);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      if (showingPosterFrameRef.current) {
        video.currentTime = 0;
        showingPosterFrameRef.current = false;
      }
      void video.play().catch(() => setLoadState("error"));
    } else {
      video.pause();
    }
  }, [playing]);

  function prepareFirstFrame() {
    const video = videoRef.current;
    if (!video || preparedRef.current || playing) return;
    preparedRef.current = true;
    showingPosterFrameRef.current = true;
    video.pause();
    if (Number.isFinite(video.duration) && video.duration > 1) {
      video.currentTime = Math.min(1, video.duration / 2);
    }
  }

  function markReady() {
    const video = videoRef.current;
    if (!video) return;
    setLoadState("ready");
  }

  return <section className={styles.videoViewer} data-state={loadState} aria-label="Video preview">
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      preload="auto"
      onLoadStart={() => setLoadState("loading")}
      onLoadedMetadata={prepareFirstFrame}
      onLoadedData={markReady}
      onCanPlay={markReady}
      onPlaying={() => setLoadState("ready")}
      onWaiting={() => setLoadState("buffering")}
      onError={() => setLoadState("error")}
    >
      Your browser does not support the video tag.
    </video>
    {loadState !== "ready" && <div className={styles.videoStatus} role="status"><span className={styles.videoSpinner}/><p>{loadState === "error" ? "Unable to load video" : loadState === "buffering" ? "Buffering video…" : "Preparing video…"}</p></div>}
    {!playing && loadState === "ready" && <span className={styles.pausedBadge}>Paused</span>}
  </section>;
}
