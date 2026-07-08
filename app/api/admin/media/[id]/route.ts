import { prisma } from "@/lib/prisma";
import { deleteFromS3 } from "@/lib/s3";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: RouteContext<"/api/admin/media/[id]">) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { status?: unknown };
    if (body.status !== "ONLINE" && body.status !== "OFFLINE") {
      return Response.json({ error: "Status must be ONLINE or OFFLINE." }, { status: 400 });
    }
    const status = body.status;

    const existing = await prisma.media.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return Response.json({ error: "Media not found." }, { status: 404 });

    await prisma.$transaction(async (transaction) => {
      if (status === "OFFLINE") {
        await transaction.display.updateMany({
          where: { activeMediaId: id },
          data: { activeMediaId: null },
        });
      }
      await transaction.media.update({ where: { id }, data: { status } });
    });

    return Response.json({ id, status });
  } catch (error) {
    console.error("Unable to update media status", error);
    return Response.json({ error: "Unable to update media status." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext<"/api/admin/media/[id]">) {
  try {
    const { id } = await context.params;
    const media = await prisma.media.findUnique({ where: { id }, select: { objectKey: true } });
    if (!media) return Response.json({ error: "Media not found." }, { status: 404 });

    await deleteFromS3(media.objectKey);
    await prisma.media.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Unable to delete media", error);
    return Response.json({ error: "Unable to delete media." }, { status: 500 });
  }
}
