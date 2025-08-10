import { getFileUrl, uploadFile } from '#src/lib/s3.ts';
import type { MultipartFile } from '@fastify/multipart';
import { prisma } from '@repo/database';
import sharp from 'sharp';

export async function processAndUploadImage(multipartFile: MultipartFile) {
  const imageBuffer = await multipartFile.toBuffer();
  const sharpInstance = sharp(imageBuffer);

  const originalImageKey = `images/original/${crypto.randomUUID()}`;

  const rotatedImage = await sharpInstance.rotate().toBuffer();

  await uploadFile({
    buffer: rotatedImage,
    key: originalImageKey,
    mimeType: multipartFile.mimetype,
    public: true,
  });

  const modifiedBuffer = await sharpInstance
    .rotate()
    .resize({ width: 800, withoutEnlargement: true })
    .jpeg()
    .toBuffer();

  const modifiedImageKey = `images/transformed/${crypto.randomUUID()}`;

  await uploadFile({
    buffer: modifiedBuffer,
    key: modifiedImageKey,
    mimeType: 'image/jpeg',
    public: true,
  });

  const modifiedImagePresignedUrl = await getFileUrl({
    key: modifiedImageKey,
    public: true,
  });

  const image = await prisma.image.create({
    data: {
      key: modifiedImageKey,
      originalKey: originalImageKey,
      public: true,
    },
  });

  return {
    imageId: image.id,
    imageUrl: modifiedImagePresignedUrl,
  };
}
