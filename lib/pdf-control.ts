export const mediaDocuments = [
  {
    id: "pdf-1",
    kind: "images",
    images: [
      "/button01/9.jpg",
      "/button01/10.jpg",
      "/button01/11.jpg",
      "/button01/12.jpg",
      "/button01/13.jpg",
      "/button01/14.jpg",
    ],
  },
  { id: "pdf-2", kind: "video", src: "/video/video01.mp4" },
  {
    id: "pdf-3",
    kind: "images",
    images: [
      "/button03/2.jpg",
      "/button03/3.jpg",
      "/button03/4.jpg",
      "/button03/5.jpg",
      "/button03/6.jpg",
      "/button03/7.jpg",
      "/button03/8.jpg",
    ],
  },
] as const;

export type PdfId = (typeof mediaDocuments)[number]["id"];
export type PdfDirection = "previous" | "next";

export type PdfPageState = {
  page: number;
  totalPages: number | null;
  updatedAt: number;
};

export type PdfControlState = Record<PdfId, PdfPageState>;

export type PdfRemoteState = {
  activePdfId: PdfId | null;
  videoPlaying: boolean;
  documents: PdfControlState;
};

export function isPdfId(value: unknown): value is PdfId {
  return mediaDocuments.some((document) => document.id === value);
}

export function isPdfDirection(value: unknown): value is PdfDirection {
  return value === "previous" || value === "next";
}
