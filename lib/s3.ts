import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getAwsConfig() {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_BUCKET;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error("AWS S3 environment variables are incomplete");
  }

  return { region, bucket, accessKeyId, secretAccessKey };
}

function getS3Client() {
  const { region, accessKeyId, secretAccessKey } = getAwsConfig();
  return new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function getObjectUrl(key: string) {
  const { bucket, region } = getAwsConfig();
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURI(key)}`;
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 900,
) {
  const { bucket } = getAwsConfig();
  return getSignedUrl(
    getS3Client(),
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn },
  );
}

export async function getPresignedDownloadUrl(key: string, expiresIn = 3600) {
  const { bucket } = getAwsConfig();
  return getSignedUrl(
    getS3Client(),
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn },
  );
}

export async function deleteFromS3(key: string) {
  const { bucket } = getAwsConfig();
  await getS3Client().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
