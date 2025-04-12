import type { FastifyTypebox } from '#src/server/fastifyTypebox.ts';
import multipart, { type MultipartFile } from '@fastify/multipart';
import { prisma } from '@open-zero/database';
import { Type } from '@sinclair/typebox';
import { getFileUrl, uploadFile } from '../../lib/s3.ts';
import { verifyIsAdmin } from '../auth/verifyIsAdmin.ts';
import { verifySession } from '../auth/verifySession.ts';
import { processAndUploadImage } from './processAndUploadImage.ts';

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

      const { imageId, imageUrl } = await processAndUploadImage(file);

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
      const { file } = request.body;
      const originalBuffer = await file.toBuffer();

      const imageKey = `food-icons/${crypto.randomUUID()}`;

      await uploadFile({
        buffer: originalBuffer,
        key: imageKey,
        mimeType: file.mimetype,
        public: true,
      });

      const image = await prisma.image.create({
        data: {
          key: imageKey,
          public: true,
        },
      });

      const presignedUrl = await getFileUrl({ key: imageKey, public: true });

      return {
        imageId: image.id,
        imageUrl: presignedUrl,
      };
    },
  );
}
