-- Add durable S3 metadata for uploaded media.
ALTER TABLE "Media"
ADD COLUMN "objectKey" TEXT,
ADD COLUMN "originalName" TEXT,
ADD COLUMN "mimeType" TEXT;

-- Preserve compatibility if media rows already exist.
UPDATE "Media"
SET
  "objectKey" = CONCAT('legacy/', "id"),
  "originalName" = "name",
  "mimeType" = CASE WHEN "type" = 'VIDEO' THEN 'video/mp4' ELSE 'image/jpeg' END;

ALTER TABLE "Media"
ALTER COLUMN "objectKey" SET NOT NULL,
ALTER COLUMN "originalName" SET NOT NULL,
ALTER COLUMN "mimeType" SET NOT NULL;

CREATE UNIQUE INDEX "Media_objectKey_key" ON "Media"("objectKey");
