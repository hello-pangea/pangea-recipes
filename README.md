![Screenshot of Hello Recipes](/assets/hello-recipes.png)

# Hello Recipes

A modern and open-source recipe manager, written 100% in TypeScript. Import and organize your favorite recipes.

[Website](https://hellorecipes.com/)

> [!WARNING]
> Hello Recipes is in early development, expect significant changes.

## Built with

- [Fastify](https://fastify.dev/)
- [React](https://react.dev/)
- [MUI](https://mui.com/)
- [Prisma and Postgres](https://www.prisma.io/)
- [TanStack Query, Router, and Form](https://tanstack.com/)
- [Better Auth](https://www.better-auth.com/)
- [Turborepo](https://turbo.build/repo)

## Getting started

### Prerequisites

- Node.js >= 22.x
- Docker (recommended) OR Postgres >= 17.x

### Setup

1. Clone the repo

```sh
git clone https://github.com/open-zero/hello-recipes.git
```

2. Go to the project folder

```sh
cd hello-recipes
```

3. Check your Node.js version

```sh
node -v
```

This should print the correct version of node. If it doesn't, use [nvm](https://github.com/nvm-sh/nvm) or a similar tool to install the correct version of node.

For [`nvm`](https://github.com/nvm-sh/nvm), run this from the project root to install the correct version of node.

```sh
nvm install && nvm use
```

4. Enable Corepack

```sh
corepack enable
```

5. Install packages with pnpm

```sh
pnpm i
```

6. Setup your `.env` files

   - Duplicate `apps/api/.env.example` to `/apps/api/.env`
   - Duplicate `apps/web/.env.example` to `/apps/web/.env`
   - Replace the example values in each `.env` file with real values

7. Run `pnpm dx` to start a local postgres instance with some seed data

   - **Requires Docker and Docker Compose to be installed**
   - Will start a local Postgres instance

## Apps

### [api](/apps/api/)

REST-ish api made with Fastify

### [web](/apps/web/)

Web app made with Vite, React, and MUI
