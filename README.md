<p align="center">
  <img alt="Hello Recipes" src="./assets/hello-recipes-banner.png" width="800" />
</p>

<p align="center">
  A modern and open source recipe manager. Never forget another recipe.
</p>

# Hello Recipes

[Website](https://hellorecipes.com/)

Hello Recipes is a modern, simple, open source recipe manager. The philosophy of this project is:

1. UX is everything. This app should be as user friendly as possible
2. Use a simple, sustainable tech stack
3. Privacy and open source are essential

> [!WARNING]
> Hello Recipes is in early development, expect significant changes.

![Screenshot of Hello Recipes](/assets/hello-recipes.png)

## Key features

- 🔗 Import recipes by url
- 📖 Organize recipes into recipe book
- 😊 Easy sharing for recipes and recipe books
- 🤝 Collaborate on recipe books with friends and family
- ⌚ Save for later
- 💻 100% open source, 100% TypeScript
- 🌐 Straightforward REST-ish api

## Built with

- [Fastify](https://fastify.dev/)
- [React](https://react.dev/)
- [MUI](https://mui.com/)
- [Prisma and Postgres](https://www.prisma.io/)
- [TanStack Query, Router, and Form](https://tanstack.com/)
- [Better Auth](https://www.better-auth.com/)
- [Turborepo](https://turbo.build/repo)

## Acknowledgements

Hello Recipes is a new project foccused on user-friendlyness. As such, it is lacking _many_ features which other amazing recipe managers provide (and which you should totally check out!)

###### [Tandoor Recipes](https://github.com/TandoorRecipes/recipes)

> Application for managing recipes, planning meals, building shopping lists and much much more!

###### [Mealie](https://github.com/mealie-recipes/mealie)

> Mealie is a self hosted recipe manager and meal planner with a RestAPI backend and a reactive frontend application built in Vue for a pleasant user experience for the whole family. Easily add recipes into your database by providing the url and mealie will automatically import the relevant data or add a family recipe with the UI editor

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
