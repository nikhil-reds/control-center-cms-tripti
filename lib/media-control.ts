export type PreviewMode = "IDLE" | "VIDEO" | "SLIDER";
export type SliderDirection = "previous" | "next";

export type MediaControlState = {
  mode: PreviewMode;
  videoPlaying: boolean;
  slideIndex: number;
  updatedAt: number;
};

export type PreviewAsset = {
  id: string;
  name: string;
  type: "IMAGE" | "VIDEO";
  url: string;
};

export type MediaRemoteState = MediaControlState & {
  asset: PreviewAsset | null;
  slideTotal: number;
};

const globalState = globalThis as typeof globalThis & {
  mediaControlState?: MediaControlState;
};

export const mediaControlState = (globalState.mediaControlState ??= {
  mode: "IDLE",
  videoPlaying: false,
  slideIndex: 0,
  updatedAt: Date.now(),
});

export function setMode(mode: PreviewMode) {
  mediaControlState.mode = mode;
  mediaControlState.videoPlaying = false;
  if (mode === "SLIDER") mediaControlState.slideIndex = 0;
  mediaControlState.updatedAt = Date.now();
}

export function isPreviewMode(value: unknown): value is Exclude<PreviewMode, "IDLE"> {
  return value === "VIDEO" || value === "SLIDER";
}

export function isSliderDirection(value: unknown): value is SliderDirection {
  return value === "previous" || value === "next";
}
