import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
const base = { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const GridIcon = (p: IconProps) => <svg {...base} {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
export const MediaIcon = (p: IconProps) => <svg {...base} {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m8 14 2.5-2.5L14 15l2-2 3 3"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>;
export const SearchIcon = (p: IconProps) => <svg {...base} {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
export const BellIcon = (p: IconProps) => <svg {...base} {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>;
export const ScreenIcon = (p: IconProps) => <svg {...base} {...p}><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
export const PlayIcon = (p: IconProps) => <svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z" fill="currentColor" stroke="none"/></svg>;
export const ClockIcon = (p: IconProps) => <svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
export const UploadIcon = (p: IconProps) => <svg {...base} {...p}><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M5 14v5h14v-5"/></svg>;
export const ZapIcon = (p: IconProps) => <svg {...base} {...p}><path d="m13 2-9 12h8l-1 8 9-12h-8Z"/></svg>;
