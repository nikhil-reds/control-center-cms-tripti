"use client";
/* eslint-disable @next/next/no-img-element -- S3 signed and local blob URLs are dynamic. */

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";
import { MediaIcon, SearchIcon, UploadIcon } from "../components/Icons";

export type MediaView = {
  id: string;
  name: string;
  type: "IMAGE" | "VIDEO";
  status: "ONLINE" | "OFFLINE";
  mimeType: string;
  sizeLabel: string;
  durationLabel: string | null;
  viewUrl: string | null;
  createdLabel: string;
};

type Metadata = { width?: number; height?: number; durationSeconds?: number };
type UploadState = "idle" | "uploading" | "saving" | "success" | "error";

function readMetadata(file: File): Promise<Metadata> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve) => {
    if (file.type.startsWith("image/")) {
      const image = new Image();
      image.onload = () => { URL.revokeObjectURL(url); resolve({ width: image.naturalWidth, height: image.naturalHeight }); };
      image.onerror = () => { URL.revokeObjectURL(url); resolve({}); };
      image.src = url;
      return;
    }
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve({ width: video.videoWidth, height: video.videoHeight, durationSeconds: Math.max(1, Math.round(video.duration)) }); };
    video.onerror = () => { URL.revokeObjectURL(url); resolve({}); };
    video.src = url;
  });
}

function putFile(url: string, file: File, onProgress: (progress: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("Content-Type", file.type);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onload = () => request.status >= 200 && request.status < 300 ? resolve() : reject(new Error("S3 rejected the upload."));
    request.onerror = () => reject(new Error("The upload connection was interrupted."));
    request.send(file);
  });
}

export function MediaManager({ initialMedia, loadError }: { initialMedia: MediaView[]; loadError?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<"ALL" | "IMAGE" | "VIDEO" | "ONLINE" | "OFFLINE">("ALL");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredMedia = useMemo(() => initialMedia.filter((item) => {
    const matchesFilter = filter === "ALL" || item.type === filter || item.status === filter;
    return matchesFilter && item.name.toLowerCase().includes(query.trim().toLowerCase());
  }), [filter, initialMedia, query]);

  function resetUpload() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null); setName(""); setPreviewUrl(null); setState("idle"); setProgress(0); setMessage("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function closeModal() { if (state === "uploading" || state === "saving") return; resetUpload(); setIsOpen(false); }

  function chooseFile(nextFile: File | undefined) {
    if (!nextFile) return;
    if (!["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"].includes(nextFile.type)) {
      setState("error"); setMessage("Use a JPG, PNG, WebP, MP4, or WebM file."); return;
    }
    if (nextFile.size > 500 * 1024 * 1024) { setState("error"); setMessage("Files must be smaller than 500 MB."); return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(nextFile);
    setName(nextFile.name.replace(/\.[^.]+$/, ""));
    setPreviewUrl(URL.createObjectURL(nextFile));
    setState("idle"); setMessage("");
  }

  async function upload() {
    if (!file || !name.trim()) return;
    try {
      setState("uploading"); setProgress(0); setMessage("Preparing secure upload…");
      const metadataPromise = readMetadata(file);
      const presignResponse = await fetch("/api/admin/media/presign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileName: file.name, contentType: file.type, sizeBytes: file.size }) });
      const presign = await presignResponse.json() as { uploadUrl?: string; key?: string; error?: string };
      if (!presignResponse.ok || !presign.uploadUrl || !presign.key) throw new Error(presign.error ?? "Unable to prepare upload.");
      setMessage("Uploading directly to S3…");
      await putFile(presign.uploadUrl, file, setProgress);
      setState("saving"); setMessage("Saving media details…");
      const metadata = await metadataPromise;
      const completeResponse = await fetch("/api/admin/media/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: presign.key, name: name.trim(), originalName: file.name, mimeType: file.type, sizeBytes: file.size, ...metadata }) });
      const complete = await completeResponse.json() as { error?: string };
      if (!completeResponse.ok) throw new Error(complete.error ?? "Unable to save media.");
      setState("success"); setProgress(100); setMessage("Upload complete.");
      router.refresh();
      window.setTimeout(() => { resetUpload(); setIsOpen(false); }, 700);
    } catch (error) {
      setState("error"); setMessage(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  async function deleteMedia(id: string, mediaName: string) {
    if (!window.confirm(`Delete “${mediaName}” from the library and S3?`)) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete media.");
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to delete media.");
    } finally { setDeletingId(null); }
  }

  async function updateStatus(item: MediaView) {
    const nextStatus = item.status === "ONLINE" ? "OFFLINE" : "ONLINE";
    setUpdatingId(item.id);
    try {
      const response = await fetch(`/api/admin/media/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to update media status.");
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to update media status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return <>
    <div className={styles.pageHead}><div><p className={styles.eyebrow}>Content library</p><h1>Media</h1><p>Upload, organise, and prepare content for every connected display.</p></div><button className={styles.primaryButton} onClick={() => setIsOpen(true)}><UploadIcon width={15}/>Upload media</button></div>
    <div className={styles.mediaToolbar}>
      <div className={styles.filters}>{(["ALL", "VIDEO", "IMAGE", "ONLINE", "OFFLINE"] as const).map(value => <button key={value} onClick={() => setFilter(value)} className={`${styles.filter} ${filter === value ? styles.filterActive : ""}`}>{value === "ALL" ? "All media" : value.charAt(0) + value.slice(1).toLowerCase()}</button>)}</div>
      <label className={styles.librarySearch}><SearchIcon width={14}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search media…" aria-label="Search media" /></label>
    </div>
    <div className={styles.libraryMeta}>{initialMedia.length} items · {initialMedia.filter(item => item.status === "ONLINE").length} online</div>
    {loadError ? <div className={styles.errorBanner}>{loadError}</div> : null}
    {filteredMedia.length ? <section className={styles.mediaGrid} aria-label="Media library">
      {filteredMedia.map(item => <article className={styles.mediaCard} key={item.id}><div className={styles.mediaPreview}>
        {item.viewUrl ? item.type === "VIDEO" ? <video src={item.viewUrl} muted preload="metadata" /> : <img src={item.viewUrl} alt="" /> : <div className={styles.mediaFallback}><MediaIcon width={26}/></div>}
        <span className={styles.mediaType}>{item.type === "VIDEO" ? "Video" : "Image"}</span>{item.durationLabel && <span className={styles.duration}>{item.durationLabel}</span>}<span className={`${styles.mediaStatus} ${item.status === "OFFLINE" ? styles.mediaStatusOffline : ""}`}><i className={item.status === "ONLINE" ? styles.onlineDot : styles.offlineDot}/>{item.status === "ONLINE" ? "Online" : "Offline"}</span>
      </div><div className={styles.mediaInfo}><div><h3>{item.name}</h3><p>{item.mimeType.split("/")[1]?.toUpperCase()} · {item.sizeLabel} · {item.createdLabel}</p></div><div className={styles.mediaActions}><button className={`${styles.statusButton} ${item.status === "OFFLINE" ? styles.statusButtonOnline : ""}`} disabled={updatingId === item.id} onClick={() => void updateStatus(item)}>{updatingId === item.id ? "Updating…" : item.status === "ONLINE" ? "Make offline" : "Make online"}</button><button className={styles.deleteButton} disabled={deletingId === item.id} onClick={() => void deleteMedia(item.id, item.name)}>{deletingId === item.id ? "…" : "Delete"}</button></div></div></article>)}
    </section> : <div className={styles.emptyState}><span><MediaIcon width={24}/></span><h2>No media found</h2><p>{initialMedia.length ? "Try another search or filter." : "Upload your first image or video to get started."}</p>{!initialMedia.length && <button className={styles.primaryButton} onClick={() => setIsOpen(true)}><UploadIcon width={15}/>Upload media</button>}</div>}

    {isOpen && <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}><section className={styles.uploadModal} role="dialog" aria-modal="true" aria-labelledby="upload-title"><div className={styles.modalHead}><div><p className={styles.eyebrow}>New asset</p><h2 id="upload-title">Upload media</h2></div><button onClick={closeModal} disabled={state === "uploading" || state === "saving"} aria-label="Close upload dialog">×</button></div>
      <label className={`${styles.dropzone} ${file ? styles.dropzoneSelected : ""}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]); }}>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" onChange={(event) => chooseFile(event.target.files?.[0])}/>
        {previewUrl && file ? file.type.startsWith("video/") ? <video src={previewUrl} muted /> : <img src={previewUrl} alt="Selected upload preview"/> : <><span className={styles.dropIcon}><UploadIcon width={22}/></span><strong>Drop an image or video here</strong><small>or click to browse · maximum 500 MB</small></>}
      </label>
      {file && <div className={styles.uploadFields}><label>Display name<input value={name} maxLength={100} onChange={(event) => setName(event.target.value)} /></label><div className={styles.fileDetails}><span>{file.name}</span><strong>{(file.size / 1024 / 1024).toFixed(1)} MB</strong></div></div>}
      {(state !== "idle" || progress > 0) && <div className={`${styles.uploadMessage} ${state === "error" ? styles.uploadError : ""}`}><div className={styles.progressTrack}><span style={{ width: `${progress}%` }}/></div><p aria-live="polite">{message}</p></div>}
      <div className={styles.modalActions}><button className={styles.secondaryButton} onClick={closeModal} disabled={state === "uploading" || state === "saving"}>Cancel</button><button className={styles.primaryButton} onClick={() => void upload()} disabled={!file || !name.trim() || state === "uploading" || state === "saving"}>{state === "uploading" || state === "saving" ? "Working…" : "Upload to library"}</button></div>
    </section></div>}
  </>;
}
