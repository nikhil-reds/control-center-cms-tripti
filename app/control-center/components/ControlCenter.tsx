"use client";

import { useCallback, useEffect, useState } from "react";
import type { MediaRemoteState, PreviewMode } from "@/lib/media-control";
import styles from "../control-center.module.css";

type ControlCenterProps = { videoCount: number; imageCount: number };
type SelectableMode = Exclude<PreviewMode, "IDLE">;

function VideoIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="14" height="14" rx="2"/><path d="m17 10 4-2v8l-4-2Z"/></svg>;
}
function ImageIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m4 18 5-5 3 3 3-3 5 5"/></svg>;
}
function PowerIcon({ off = false }: { off?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2v10"/><path d={off ? "M5 5 19 19M6.4 6.4A8 8 0 1 0 17.6 6.4" : "M6.3 5.7a8 8 0 1 0 11.4 0"}/></svg>;
}
function PlayIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m8 5 11 7-11 7Z"/></svg>; }
function PauseIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>; }
function ArrowIcon({ right = false }: { right?: boolean }) { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d={right ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"}/></svg>; }

export function ControlCenter({ videoCount, imageCount }: ControlCenterProps) {
  const [remoteState, setRemoteState] = useState<MediaRemoteState | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/media-control", { cache: "no-store" });
      if (!response.ok) throw new Error();
      setRemoteState(await response.json() as MediaRemoteState);
    } catch { setMessage("Unable to reach the preview service."); }
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => void refresh(), 1500);
    return () => { window.clearTimeout(initialTimer); window.clearInterval(timer); };
  }, [refresh]);

  async function command(body: Record<string, string>) {
    if (pending) return;
    setPending(true); setMessage("Sending command…");
    try {
      const response = await fetch("/api/media-control", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json() as MediaRemoteState & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Command failed.");
      setRemoteState(data); setMessage("Preview updated.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Command failed."); }
    finally { setPending(false); }
  }

  const mode = remoteState?.mode ?? "IDLE";
  return <main className={styles.mediaPage}>
    <header className={styles.mediaHeader}><p>Cloud media controller</p><h1>Control Center</h1><span>Activate one experience at a time and control what appears on the preview screen.</span></header>
    <section className={styles.mediaControls} aria-label="Preview media controls">
      <MediaCard mode="VIDEO" title="Video" description="Open the latest online cloud video, then control playback." count={videoCount} active={mode === "VIDEO"} pending={pending} onCommand={command}/>
      <MediaCard mode="SLIDER" title="Image Slider" description="Present every online cloud image and move through the collection." count={imageCount} active={mode === "SLIDER"} pending={pending} onCommand={command} slidePosition={remoteState?.mode === "SLIDER" ? `${remoteState.slideIndex + 1} / ${remoteState.slideTotal}` : undefined}/>
    </section>
    <p className={styles.mediaMessage} aria-live="polite">{message}</p>
  </main>;
}

function MediaCard({ mode, title, description, count, active, pending, onCommand, slidePosition }: { mode: SelectableMode; title: string; description: string; count: number; active: boolean; pending: boolean; onCommand: (body: Record<string, string>) => Promise<void>; slidePosition?: string }) {
  const available = count > 0;
  return <article className={`${styles.mediaCard} ${active ? styles.mediaCardActive : ""}`}>
    <div className={`${styles.mediaCardIcon} ${mode === "SLIDER" ? styles.sliderIcon : ""}`}>{mode === "VIDEO" ? <VideoIcon/> : <ImageIcon/>}</div>
    <span className={`${styles.activeBadge} ${active ? styles.activeBadgeOn : ""}`}>{active ? "Active" : "Inactive"}</span>
    <h2>{title}</h2><p>{description}</p><small>{count} online {mode === "VIDEO" ? `video${count === 1 ? "" : "s"}` : `image${count === 1 ? "" : "s"}`}{slidePosition ? ` · ${slidePosition}` : ""}</small>
    <div className={styles.powerRow}><button className={styles.onButton} disabled={!available || pending || active} onClick={() => void onCommand({ action: "activate", mode })}><PowerIcon/>On</button><button className={styles.offButton} disabled={pending || !active} onClick={() => void onCommand({ action: "deactivate" })}><PowerIcon off/>Off</button></div>
    <div className={styles.transport} aria-label={`${title} controls`}>
      {mode === "VIDEO" ? <><button disabled={!active || pending} onClick={() => void onCommand({ action: "playback", playback: "play" })}><PlayIcon/>Play</button><button disabled={!active || pending} onClick={() => void onCommand({ action: "playback", playback: "pause" })}><PauseIcon/>Pause</button></> : <><button disabled={!active || pending} onClick={() => void onCommand({ action: "navigate", direction: "previous" })}><ArrowIcon/>Left</button><button disabled={!active || pending} onClick={() => void onCommand({ action: "navigate", direction: "next" })}>Right<ArrowIcon right/></button></>}
    </div>
  </article>;
}
