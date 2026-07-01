"use client";

import { useState } from "react";
import type { PdfDirection } from "@/lib/pdf-control";
import type { ControlOption } from "../control-options";
import styles from "../control-center.module.css";
import { ControlCard } from "./ControlCard";
import { DetailScreen } from "./DetailScreen";

type ControlCenterProps = {
  options: ControlOption[];
};

export function ControlCenter({ options }: ControlCenterProps) {
  const [selectedOption, setSelectedOption] = useState<ControlOption | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("");

  async function selectOption(option: ControlOption) {
    if (isSending) return;

    setIsSending(true);
    setStatus("Opening…");

    try {
      const response = await fetch("/api/pdf-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "activate", pdfId: option.pdfId }),
      });

      if (!response.ok) throw new Error("Activation failed");
      setSelectedOption(option);
      setStatus("");
    } catch {
      setStatus("Unable to open preview");
    } finally {
      setIsSending(false);
    }
  }

  async function sendCommand(direction: PdfDirection) {
    if (!selectedOption || isSending) return;

    setIsSending(true);
    setStatus("Sending…");

    try {
      const response = await fetch("/api/pdf-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "navigate",
          pdfId: selectedOption.pdfId,
          direction,
        }),
      });

      if (!response.ok) throw new Error("Command failed");
      setStatus("Command sent");
    } catch {
      setStatus("Unable to reach preview");
    } finally {
      setIsSending(false);
    }
  }

  async function closePreview() {
    if (isSending) return;

    setIsSending(true);
    setStatus("Closing…");

    try {
      const response = await fetch("/api/pdf-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });

      if (!response.ok) throw new Error("Clear failed");
      setSelectedOption(null);
      setStatus("");
    } catch {
      setStatus("Unable to close preview");
    } finally {
      setIsSending(false);
    }
  }

  async function sendPlayback(playback: "play" | "pause") {
    if (!selectedOption || isSending) return;

    setIsSending(true);
    setStatus(playback === "play" ? "Playing…" : "Pausing…");

    try {
      const response = await fetch("/api/pdf-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "playback", playback }),
      });

      if (!response.ok) throw new Error("Playback command failed");
      setStatus(playback === "play" ? "Video playing" : "Video paused");
    } catch {
      setStatus("Unable to control video");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      {selectedOption ? (
        <DetailScreen
          option={selectedOption}
          isSending={isSending}
          status={status}
          onNavigate={sendCommand}
          onPlayback={sendPlayback}
          onBack={closePreview}
        />
      ) : (
        <section className={styles.controls} aria-label="Treatment options">
          {options.map((option) => (
            <ControlCard
              key={option.id}
              option={option}
              onSelect={() => void selectOption(option)}
            />
          ))}
          {status ? (
            <p className={styles.selectionStatus} aria-live="polite">
              {status}
            </p>
          ) : null}
        </section>
      )}
    </main>
  );
}
