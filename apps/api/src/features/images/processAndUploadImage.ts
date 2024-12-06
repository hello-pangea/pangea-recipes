import { prisma } from '#src/lib/prisma.js';
import { uploadFile } from '#src/lib/s3.js';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';

export async function processAndUploadImage(imageBuffer: Buffer) {
  const sharpInstance = sharp(imageBuffer);

  const originalImageKey = `images/original/${crypto.randomUUID()}.jpg`;

  const rotatedImage = await sharpInstance.rotate().toBuffer();

  const originalMimeType = await fileTypeFromBuffer(imageBuffer);

  await uploadFile({
    buffer: rotatedImage,
    key: originalImageKey,
    mimeType: originalMimeType?.mime ?? 'image/jpeg',
  });

  const modifiedBuffer = await sharpInstance
    .rotate()
    .resize({ width: 800, withoutEnlargement: true })
    .jpeg()
    .toBuffer();

  const modifiedImageKey = `images/transformed${crypto.randomUUID()}.jpg`;

  await uploadFile({
    buffer: modifiedBuffer,
    key: modifiedImageKey,
    mimeType: 'image/jpeg',
  });

  const modifiedImageUrl = `https://assets.hellorecipes.com/${modifiedImageKey}`;

  const image = await prisma.image.create({
    data: {
      key: modifiedImageKey,
      originalKey: originalImageKey,
    },
  });

  return {
    imageId: image.id,
    imageUrl: modifiedImageUrl,
  };
}
