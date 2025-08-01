<p align="center">
  <img alt="Pangea Recipes" src="./assets/hello-recipes-banner.png" width="800" />
</p>

<p align="center">
  <a href="https://github.com/open-zero/hello-recipes/blob/main/LICENSE"><img src="https://img.shields.io/github/license/open-zero/hello-recipes" /></a>
  <a href="https://hellorecipes.com/"><img src="https://img.shields.io/badge/demo-online-brightgreen" /></a>
  <a href="https://hellorecipes.com/openapi-docs"><img src="https://img.shields.io/badge/docs-OpenApi-blue" /></a>
</p>

# Pangea Recipes

A modern, open source recipe manager focused on privacy, collaboration, and ease of use. This app makes it easy to import, create, and organize your recipes. You can share recipes and collaborate on recipe books with friends and family. Never forget another recipe.

[**Website →**](https://hellorecipes.com/)

[Demo recipe](https://hellorecipes.com/app/shared-recipes/d4dff988-6617-4aa0-800b-52eb03a6f4b6)

[OpenApi Docs](https://hellorecipes.com/openapi-docs/)

![Screenshot of Pangea Recipes](/assets/hello-recipes.png)

## Project status

Pangea Recipes is in active development! It's ready for use if you're ok with a limited feature set. Developers should expect breaking changes to the api.

## Key features

- 🔗 Import recipes by url
- 📖 Organize recipes into recipe books
- 😊 Easy sharing for recipes and recipe books
- 🤝 Collaborate on recipe books with friends and family
- ⌚ Save for later
- 💻 100% open source, 100% TypeScript
- 🌐 [REST-ish api](https://hellorecipes.com/openapi-docs/)

## Built with

- [Fastify](https://fastify.dev/)
- [Prisma and Postgres](https://www.prisma.io/)
- [React and React Compiler](https://react.dev/)
- [MUI](https://mui.com/)
- [TanStack Query, Router, Start, and Form](https://tanstack.com/)
- [Better Auth](https://www.better-auth.com/)
- [Vite](https://vite.dev/)
- [Turborepo](https://turbo.build/repo)

## Getting started

### Prerequisites

- Node.js >= 22.x
- Docker (recommended) OR Postgres >= 17.x

### Quick Start

```sh
git clone https://github.com/open-zero/hello-recipes.git
cd hello-recipes
corepack enable
pnpm install
# Setup your .env files
pnpm dx # Start Postgres (requires Docker)
pnpm dev # Start the app
```

## Apps

### [api](/apps/api/)

REST-ish api made with Fastify

### [web](/apps/web/)

Web app made with Vite, React, and MUI

## Acknowledgements

Pangea Recipes is a new project focused on simplicity. As such, it is lacking _many_ features which other amazing recipe managers provide (and which you should totally check out!)

###### [Tandoor Recipes](https://github.com/TandoorRecipes/recipes)

> Application for managing recipes, planning meals, building shopping lists and much much more!

###### [Mealie](https://github.com/mealie-recipes/mealie)

> Mealie is a self hosted recipe manager and meal planner with a RestAPI backend and a reactive frontend application built in Vue for a pleasant user experience for the whole family. Easily add recipes into your database by providing the url and mealie will automatically import the relevant data or add a family recipe with the UI editor

## License

This project is licensed under the [GNU AGPLv3](./LICENSE).
