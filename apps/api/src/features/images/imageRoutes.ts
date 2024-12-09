import type { FastifyTypebox } from '#src/server/fastifyTypebox.js';
import multipart, { type MultipartFile } from '@fastify/multipart';
import { Type } from '@sinclair/typebox';
import { prisma } from '../../lib/prisma.js';
import { getFileUrl, uploadFile } from '../../lib/s3.js';
import { verifyIsAdmin } from '../auth/verifyIsAdmin.js';
import { verifySession } from '../auth/verifySession.js';
import { processAndUploadImage } from './processAndUploadImage.js';

const routeTag = 'Images';

// eslint-disable-next-line @typescript-eslint/require-await
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
      preHandler: fastify.auth([verifySession]),
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
            imageId: Type.String({ format: 'uuid' }),
            imageUrl: Type.String(),
          }),
        },
      },
    },
    async (request) => {
      const file = request.body.file;
      const originalBuffer = await file.toBuffer();

      const { imageId, imageUrl } = await processAndUploadImage(originalBuffer);

      return {
        imageId: imageId,
        imageUrl: imageUrl,
      };
    },
  );

  fastify.post(
    '/food-icon',
    {
      preHandler: fastify.auth([verifyIsAdmin]),
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
            imageId: Type.String({ format: 'uuid' }),
            imageUrl: Type.String(),
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

      const presignedUrl = await getFileUrl(imageKey);

      return {
        imageId: image.id,
        imageUrl: presignedUrl,
      };
    },
  );
}
