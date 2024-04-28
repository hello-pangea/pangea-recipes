# Adapted from the Turborepo example at
# https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/api/Dockerfile

FROM node:20-bookworm-slim AS base

FROM base AS builder

WORKDIR /app

RUN npm install turbo -g

COPY . .
RUN turbo prune api --docker

FROM base AS installer

WORKDIR /app

RUN corepack enable

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile

# Set node to production after installing dependencies and before building
ENV NODE_ENV production

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo build --filter=api...

FROM base AS runner

# Set node to production after installing dependencies and before building
ENV NODE_ENV production

USER node

WORKDIR /app

COPY --from=installer --chown=node:node /app .

EXPOSE 8080

CMD node apps/api/dist/index.js