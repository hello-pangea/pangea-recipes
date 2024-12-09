import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config/config.js';

export const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${config.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: config.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export function uploadFile(data: {
  key: string;
  buffer: Buffer;
  mimeType: string;
}) {
  const uploadParams: PutObjectCommandInput = {
    Bucket: 'hello-recipes',
    Key: data.key,
    Body: data.buffer,
    ContentType: data.mimeType,
  };

  const uploadCommand = new PutObjectCommand(uploadParams);

  return s3Client.send(uploadCommand);
}

export async function getFileUrl(key: string) {
  const presignedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: 'hello-recipes', Key: key }),
    { expiresIn: 3600 },
  );

  return presignedUrl;
}
