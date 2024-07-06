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

      const originalImageKey = `images/original/${crypto.randomUUID()}.jpg`;

      const rotatedImage = await sharpInstance.rotate().toBuffer();

      await uploadFile({
        buffer: rotatedImage,
        key: originalImageKey,
        mimeType: file.mimetype,
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
        image_id: image.id,
        image_url: modifiedImageUrl,
      };
    },
  );

  fastify.post(
    '/food-icon',
    {
      schema: {
        tags: [routeTag],
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

      const imageKey = `food-icons/${crypto.randomUUID()}.svg`;

      await uploadFile({
        buffer: originalBuffer,
        key: imageKey,
        mimeType: file.mimetype,
      });

      const image = await prisma.image.create({
        data: {
          key: imageKey,
        },
      });

      return {
        image_id: image.id,
        image_url: imageKey,
      };
    },
  );
}
