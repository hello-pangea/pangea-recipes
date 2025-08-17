# Adapted from the Turborepo example at
# https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/api/Dockerfile

FROM node:22-bookworm-slim AS base

# Install openssl and clean up in a single layer
# Required for prisma
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

# Playwright vars
ENV PLAYWRIGHT_BROWSERS_PATH=/app/.playwright
# PNPM vars
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack and install turbo globally
RUN corepack enable && npm install -g corepack@latest

# Global turborepo
RUN pnpm install turbo@2.5.6 --global

# Playwright setup (basically downloads chromium)
RUN pnpm dlx playwright-chromium@1.54.2 install chromium --with-deps

# ---
# - We download packages asap to avoid re-downloads on code changes
# - We only redownload when the lockfile changes
# ---
FROM base AS fetcher

COPY pnpm*.yaml ./
RUN pnpm fetch --ignore-scripts

# ---
# Use turbo prone to pull out relevant deps only
# ---
FROM base AS pruner

WORKDIR /app
COPY . .
RUN turbo prune api --docker

# ---
# Build the app
# ---
FROM fetcher AS builder

WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# Install all deps (prod & dev) from the cache
RUN pnpm install --frozen-lockfile --offline --silent

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

# Time to build! :)
RUN turbo build --filter=api...

# Remove all deps then install only prod deps
RUN rm -rf node_modules
RUN pnpm install --prod --frozen-lockfile --offline --silent

# ---
# Run the app (yippee!)
# ---
FROM base AS runner

USER node

WORKDIR /app

ENV NODE_ENV="production"

COPY --chown=node:node --from=builder /app .

ARG PORT
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["node", "--import", "./apps/api/src/instrument.ts", "apps/api/src/index.ts"]