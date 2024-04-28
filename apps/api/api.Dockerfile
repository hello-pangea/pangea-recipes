# Adapted from the Turborepo example at
# https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/api/Dockerfile

FROM node:20-bookworm-slim AS base

RUN apt-get update -y && apt-get install -y openssl

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm install turbo --global

FROM base AS builder

WORKDIR /app

COPY . .
RUN turbo prune api --docker

FROM base AS installer

WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY .npmrc .npmrc
COPY --from=builder /app/out/json/ .

RUN pnpm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm rebuild -F=database

RUN turbo build --filter=api...

FROM base AS runner

# Set node to production after installing dependencies and before building
ENV NODE_ENV production

USER node

WORKDIR /app

COPY --from=installer --chown=node:node /app .

EXPOSE 8080

CMD node apps/api/dist/index.js