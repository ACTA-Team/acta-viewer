# ACTA Viewer

[![CI](https://github.com/ACTA-Team/acta-viewer/actions/workflows/ci.yml/badge.svg)](https://github.com/ACTA-Team/acta-viewer/actions/workflows/ci.yml)
[![CodeQL](https://github.com/ACTA-Team/acta-viewer/actions/workflows/codeql.yml/badge.svg)](https://github.com/ACTA-Team/acta-viewer/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Web viewer for [ACTA](https://acta.build) verifiable credentials and `did:stellar` identities on Stellar.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, React Compiler, Cache Components)
- [React 19](https://react.dev) and [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- ESLint, Prettier, Husky and lint-staged

## Getting started

Requirements: Node.js 24 (see [`.nvmrc`](.nvmrc)) and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                 | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the development server      |
| `npm run build`        | Create a production build         |
| `npm run start`        | Serve the production build        |
| `npm run lint`         | Lint with ESLint                  |
| `npm run lint:fix`     | Lint and auto-fix                 |
| `npm run typecheck`    | Type-check with TypeScript        |
| `npm run format`       | Format all files with Prettier    |
| `npm run format:check` | Verify formatting without writing |

## Project structure

```
src/
  app/          # App Router routes, layouts and global styles
public/         # Static assets
.github/        # CI workflows, Dependabot and templates
.husky/         # Git hooks
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Commits are formatted automatically on `pre-commit`, and lint, typecheck and build run on `pre-push` and in CI.

## Resources

- [ACTA documentation](https://docs.acta.build)
- [ACTA SDK](https://github.com/ACTA-Team/acta-credentials)
- [did:stellar](https://github.com/ACTA-Team/did-stellar)

## License

[MIT](LICENSE) © ACTA
