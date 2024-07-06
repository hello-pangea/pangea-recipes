import {
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { config } from '../config/config.js';

const s3Client = new S3Client({
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

export function getFileUrl(key: string) {
  return `https://assets.hellorecipes.com/${key}`;
}
