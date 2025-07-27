import multipart, { type MultipartFile } from '@fastify/multipart';
import { prisma } from '@open-zero/database';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { getFileUrl, uploadFile } from '../../lib/s3.ts';
import { verifyIsAdmin } from '../auth/verifyIsAdmin.ts';
import { verifySession } from '../auth/verifySession.ts';
import { processAndUploadImage } from './processAndUploadImage.ts';

const routeTag = 'Images';

// eslint-disable-next-line @typescript-eslint/require-await
export const imageRoutes: FastifyPluginAsyncZod = async function (fastify) {
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
        body: z.object({
          file: z.custom<MultipartFile>().meta({
            isFile: true,
          }),
        }),
        response: {
          200: z.object({
            imageId: z.uuidv4(),
            imageUrl: z.string(),
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
        body: z.object({
          file: z.custom<MultipartFile>().meta({
            isFile: true,
          }),
        }),
        response: {
          200: z.object({
            imageId: z.uuidv4(),
            imageUrl: z.string(),
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
};
