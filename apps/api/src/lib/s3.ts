import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config/config.ts';

export const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${config.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: config.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

export function uploadFile(data: {
  key: string;
  buffer: Buffer;
  mimeType: string;
  public?: boolean;
}) {
  const uploadParams: PutObjectCommandInput = {
    Bucket: data.public
      ? config.PUBLIC_BUCKET_NAME
      : config.PRIVATE_BUCKET_NAME,
    Key: data.key,
    Body: data.buffer,
    ContentType: data.mimeType,
  };

  const uploadCommand = new PutObjectCommand(uploadParams);

  return s3Client.send(uploadCommand);
}

export async function getFileUrl(data: { key: string; public: boolean }) {
  if (data.public) {
    return `https://${config.PUBLIC_BUCKET_DOMAIN}/${data.key}`;
  }

  const presignedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: config.PRIVATE_BUCKET_NAME, Key: data.key }),
    { expiresIn: 3600 },
  );

  return presignedUrl;
}
