"use client";

import Image from "next/image";
import styles from "../preview.module.css";

type ImageViewerProps = {
  images: readonly string[];
  pageNumber: number;
  label: string;
};

export function ImageViewer({
  images,
  pageNumber,
  label,
}: ImageViewerProps) {
  const safeIndex = Math.min(images.length - 1, Math.max(0, pageNumber - 1));
  const src = images[safeIndex];

  return (
    <section
      className={styles.imageViewer}
      aria-label={`${label} image ${safeIndex + 1} of ${images.length}`}
    >
      <div key={src} className={styles.imageSlide}>
        <Image
          src={src}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.sequenceImage}
        />
      </div>
    </section>
  );
}
