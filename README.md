# Hello Recipes

Save, savor, and share your recipes. A modern and intuitive recipe manager.

## Major technologies

- [Turborepo](https://turbo.build/repo) (monorepo tooling)
- [Postgres and Prisma](https://www.prisma.io/) (database and ORM)
- Typescript, ESLint, and Prettier are used to improve the developer experience

## Prerequisites

- [Node.js 22.x](https://nodejs.org/en/)
- [PNPM 9.x](https://pnpm.io/)
- [Postgres 16.x](https://www.postgresql.org/)

## Development

### Setup

1. Clone the repo

2. Navigate to the project root

3. Run `pnpm i` to install dependencies

4. Run `pnpm dx` to start a local postgres instance with some seed data

## Apps

### [api](/apps/api/)

REST-ish api made with Fastify

### [web-app](/apps/web-app/)

Primary web app made with Vite, React, and MUI
