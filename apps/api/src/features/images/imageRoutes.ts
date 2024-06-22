import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import multipart, { type MultipartFile } from '@fastify/multipart';
import { Type } from '@sinclair/typebox';
import sharp from 'sharp';
import { prisma } from '../../lib/prisma.js';
import { uploadFile } from '../../lib/s3.js';

const routeTag = 'Images';

export async function imageRoutes(fastify: FastifyTypebox) {
  void fastify.register(multipart, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 10000000,
    },
  });

  fastify.post(
    '',
    {
      schema: {
        tags: [routeTag],
        summary: 'Get params to authenticate an upload with Transloadit',
        consumes: ['multipart/form-data'],
        body: Type.Object({
          file: Type.Unsafe<MultipartFile>({
            isFile: true,
          }),
        }),
        response: {
          200: Type.Object({
            image_id: Type.String({ format: 'uuid' }),
            image_url: Type.String(),
          }),
        },
      },
    },
    async (request) => {
      const file = request.body.file;
      const originalBuffer = await file.toBuffer();

      const sharpInstance = sharp(originalBuffer);

      const originalImageFileName = `${crypto.randomUUID()}.jpg`;

      const rotatedImage = await sharpInstance.rotate().toBuffer();

      await uploadFile({
        buffer: rotatedImage,
        fileName: originalImageFileName,
        mimeType: file.mimetype,
      });

      const originalImageUrl = `https://assets.hellorecipes.com/${originalImageFileName}`;

      const modifiedMetadata = await sharpInstance.metadata();

      if (
        modifiedMetadata.width === undefined ||
        modifiedMetadata.height === undefined
      ) {
        throw new Error('Invalid image metadata');
      }

      const modifiedBuffer = await sharpInstance
        .rotate()
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg()
        .toBuffer();

      const modifiedImageFileName = `${crypto.randomUUID()}.jpg`;

      await uploadFile({
        buffer: modifiedBuffer,
        fileName: modifiedImageFileName,
        mimeType: 'image/jpeg',
      });

      const modifiedImageUrl = `https://assets.hellorecipes.com/${modifiedImageFileName}`;

      const image = await prisma.image.create({
        data: {
          url: modifiedImageUrl,
          originalUrl: originalImageUrl,
          height:
            (modifiedMetadata.orientation ?? 0) >= 5
              ? modifiedMetadata.width
              : modifiedMetadata.height,
          width:
            (modifiedMetadata.orientation ?? 0) >= 5
              ? modifiedMetadata.height
              : modifiedMetadata.width,
        },
      });

      return {
        image_id: image.id,
        image_url: modifiedImageUrl,
      };
    },
  );
}
