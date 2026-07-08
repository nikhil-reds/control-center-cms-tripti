import { prisma } from "@/lib/prisma";
import { ControlCenter } from "./components/ControlCenter";

export default async function ControlCenterPage() {
  let videoCount = 0;
  let imageCount = 0;
  try {
    [videoCount, imageCount] = await Promise.all([
      prisma.media.count({ where: { type: "VIDEO", status: "ONLINE" } }),
      prisma.media.count({ where: { type: "IMAGE", status: "ONLINE" } }),
    ]);
  } catch (error) {
    console.error("Unable to load control availability", error);
  }

  return <ControlCenter videoCount={videoCount} imageCount={imageCount} />;
}
