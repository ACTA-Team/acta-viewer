# Contributing

Thanks for your interest in improving ACTA Viewer.

## Setup

```bash
nvm use        # Node.js 24 (see .nvmrc)
npm install    # also installs the git hooks
npm run dev
```

## Workflow

1. Create a branch from `main` (`feat/...`, `fix/...`, `chore/...`).
2. Make focused, atomic commits using [Conventional Commits](https://www.conventionalcommits.org/):
   `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `build:`, `ci:`, `chore:`.
3. Open a pull request against `main` with a conventional title and fill in the template.

## Git hooks

Hooks are managed with [Husky](https://typicode.github.io/husky/) and installed by `npm install`.

| Hook         | Runs                                                 |
| ------------ | ---------------------------------------------------- |
| `pre-commit` | Prettier on staged files (via `lint-staged`)         |
| `pre-push`   | `npm run lint`, `npm run typecheck`, `npm run build` |

## Continuous integration

Every push and pull request to `main` runs:

- **CI** – format check, lint, typecheck and production build.
- **CodeQL** – static security analysis (also weekly).
- **Dependency Review** – blocks pull requests that add vulnerable dependencies.
- **PR Title** – validates Conventional Commit titles.

Dependabot opens weekly updates for npm packages and GitHub Actions.
