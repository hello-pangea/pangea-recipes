# Adapted from the Turborepo example at
# https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/api/Dockerfile

FROM node:20-bookworm-slim AS base

# Install openssl and clean up in a single layer
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set environment variables for PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack and install turbo globally
RUN corepack enable && pnpm install turbo --global

# Builder stage
FROM base AS builder

WORKDIR /app
COPY . .
RUN turbo prune api --docker

# Installer stage
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

RUN pnpm exec playwright install --with-deps

# Force prisma's postinstall script to work properly
RUN pnpm rebuild -F=database

# Build :)
RUN turbo build --filter=api...

# Prune dev deps away
# https://pnpm.io/cli/prune
# This is breaking the build, so we'll skip it for now
# RUN rm -rf node_modules
# RUN pnpm install --frozen-lockfile --offline --production

FROM base AS runner

# Set node to production after installing dependencies and before building
ENV NODE_ENV="production"

USER node

WORKDIR /app

COPY --from=installer --chown=node:node /app .

EXPOSE 8080

CMD ["node", "apps/api/dist/index.js"]