"use client";

import { useCallback, useEffect, useState } from "react";
import type { MediaRemoteState } from "@/lib/media-control";
import styles from "../preview.module.css";
import { ImageViewer } from "./ImageViewer";
import { VideoViewer } from "./VideoViewer";

const idleState: MediaRemoteState = {
  mode: "IDLE",
  videoPlaying: false,
  slideIndex: 0,
  slideTotal: 0,
  asset: null,
  updatedAt: 0,
};

export function PreviewWall() {
  const [state, setState] = useState<MediaRemoteState>(idleState);
  const [apiOnline, setApiOnline] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/media-control", { cache: "no-store" });
      if (!response.ok) throw new Error("State request failed");
      const incoming = await response.json() as MediaRemoteState;
      setState((current) => {
        if (
          incoming.asset && current.asset &&
          incoming.asset.id === current.asset.id &&
          current.asset.urlExpiresAt - Date.now() > 5 * 60 * 1000
        ) {
          return { ...incoming, asset: { ...incoming.asset, url: current.asset.url, urlExpiresAt: current.asset.urlExpiresAt } };
        }
        return incoming;
      });
      setApiOnline(true);
    } catch { setApiOnline(false); }
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => void refresh(), 1000);
    return () => { window.clearTimeout(initialTimer); window.clearInterval(timer); };
  }, [refresh]);

  return <main className={styles.wall}>
    <span className={styles.connection} data-online={apiOnline}>{apiOnline ? "Connected" : "Reconnecting"}</span>
    {state.mode === "VIDEO" && state.asset?.type === "VIDEO" ? <VideoViewer key={state.asset.id} src={state.asset.url} playing={state.videoPlaying}/> : state.mode === "SLIDER" && state.asset?.type === "IMAGE" ? <ImageViewer key={state.asset.id} src={state.asset.url} name={state.asset.name} index={state.slideIndex} total={state.slideTotal}/> : <PreviewSplash/>}
  </main>;
}

function PreviewSplash() {
  return <section className={styles.splash} aria-label="Rubenius idle screen"><div className={styles.splashGlow}/><div className={styles.splashBrand}><span>R</span><h1>Rubenius</h1><p>Experience ready</p></div></section>;
}
