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

# pnpm fetch is expensive
# We only copy over package.jsons and other dep stuff before running it
# That way changing code won't invalidate the dependency step
COPY --from=builder /app/out/json/ .
RUN pnpm fetch

# Now copy over the rest of the source code

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Should be quick due to the earlier fetch
RUN pnpm install --frozen-lockfile --offline

# Force prisma's postinstall script to work properly
RUN pnpm rebuild -F=database

# Build :)
RUN turbo build --filter=api...

# Prune dev deps away
# https://pnpm.io/cli/prune
RUN rm -rf node_modules
RUN pnpm install --frozen-lockfile --offline --production

FROM base AS runner

# Set node to production after installing dependencies and before building
ENV NODE_ENV production

USER node

WORKDIR /app

COPY --from=installer --chown=node:node /app .

EXPOSE 8080

CMD node apps/api/dist/index.js