# Sudoku &middot; [![CI](https://github.com/patricklizon/sudoku/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/patricklizon/sudoku/actions/workflows/ci.yml)

Web app based on SolidStart, Solid.js, and Vinxi, powered by a Nix-based development environment.

## Table of content

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Stack](#stack)
- [Testing](#testing)
- [CI](#ci)
- [Scripts](#scripts)
- [Deployment](#deployment)

## Prerequisites

- [Nix](https://nixos.org/download/) - A powerful package manager for reproducible builds.
- [direnv](https://direnv.net/) - A shell extension that automatically loads and unloads environment variables, integrating seamlessly with Nix.

For a smooth development experience, ensure Nix and direnv are installed and configured on your system.

### Install Nix:

On macOS and Linux, install Nix using the recommended multi-user installer.
For the most up-to-date and detailed instructions, refer to the [official Nix installation guide](https://nixos.org/download/).

```sh
sh <(curl -L https://nixos.org/nix/install) --daemon
```

Follow the on-screen prompts to complete the installation.

### Configure direnv hook:

After installing direnv, you need to integrate it with your shell.
For the most accurate and up-to-date instructions for your specific shell, consult the [direnv documentation on shell integration](https://direnv.net/docs/hook.html).
Add the following line to your shell's configuration file (e.g., `~/.bashrc` for Bash, `~/.zshrc` for Zsh, or `~/.config/fish/config.fish` for Fish):

```sh
eval "$(direnv hook <your_shell_name>)"
```

Replace `<your_shell_name>` with your actual shell (e.g., `bash`, `zsh`, `fish`). After adding the hook, restart your terminal or source your shell's configuration file (e.g., `source ~/.bashrc`) for the changes to take effect. This enables direnv to automatically load and unload the project's development environment defined in `flake.nix` when you navigate into the project directory.

## Setup

This project uses Nix and direnv for managing its development environment, including Node.js and Bun versions.

### Allow direnv to load the Nix environment:

```sh
direnv allow
```

This command, when run in the project root, will read `flake.nix` and provision the development environment, including Bun and Node.js. The `.bun-version` and `.node-version` files will be automatically updated by the `flake.nix` shell hook to reflect the versions provided by Nix.

### Install dependencies using Bun:

```sh
bun install
```

(Bun is provided by the Nix development environment)

### Copy environmental variables (if applicable):

```sh
cp .env.example .env
```

### Start the development server:

```sh
bun run dev
```

## Stack

### Framework & Libraries

- [Solid.js](https://www.solidjs.com/) - A reactive UI library for building user interfaces.
- [SolidStart](https://start.solidjs.com/) - A Solid.js meta-framework for fullstack applications.
- [Vinxi](https://vinxi.dev/) - The full-stack web framework that powers SolidStart, providing bundling and server capabilities.
- [TypeScript](https://www.typescriptlang.org/) - Typed language built on top of JavaScript.

### Development Tools

- [Nix](https://nixos.org/) - For reproducible development environments and package management.
- [Bun](https://bun.sh/) - A fast all-in-one JavaScript runtime, bundler, test runner, and package manager.
- [ESLint](https://eslint.org) - Static code analysis for identifying problematic patterns.
- [Oxlint](https://oxc-project.github.io/docs/guide/oxlint/what_is_oxlint.html) - A fast Rust-based linter.
- [Prettier](https://prettier.io) - An opinionated code formatter.
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) - Cloudflare's CLI tool for developing and deploying Workers and Pages.

## Testing

This project employs a comprehensive testing strategy using [Vitest](https://vitest.dev/) for unit and browser-based component tests, and [Playwright](https://playwright.dev/) for end-to-end (E2E) tests.

### Testing Structure

- **Unit Testing**: Vitest runs unit tests (`*.spec.ts`) in Node.js environment for utilities and logic testing (22 test files)
- **Browser Testing**: Vitest with Playwright provider runs component tests (`*.spec.browser.tsx`) in Chromium for UI components (1 test file)
- **End-to-End Testing**: Playwright executes E2E tests in `e2e/` directory against the built application using Wrangler preview server
- **Page Objects**: Shared page object pattern with adapters for both Vitest and Playwright test environments

### Test Configuration

- **Unit Tests**: Run in Node.js environment with SolidJS Testing Library setup
- **Browser Tests**: Run in headless Chromium with 5-second timeout
- **E2E Tests**: Run against `http://localhost:8787` (Wrangler preview) with retry logic in CI
- **CI Integration**: Tests run in GitHub Actions with proper browser installation and artifact management

For detailed commands, see the [Testing Scripts](#testing) section.

## CI

The project uses GitHub Actions for Continuous Integration, defined in `.github/workflows/ci.yml`. The CI pipeline runs on every pull request and push to the `main` branch, ensuring code quality and stability with automatic deployment to Cloudflare.

The CI workflow includes the following jobs:

- **install-dependencies**: Installs project dependencies using Bun.
- **install-browsers**: Installs Playwright browser binaries for E2E testing.
- **quality-checks**: A matrix job running parallel checks:
  - `check:format`: Verifies code formatting with Prettier.
  - `check:types`: Validates TypeScript types.
  - `check:lint`: Runs ESLint and Oxlint static analysis.
  - `check:typegen`: Ensures Cloudflare worker types are up-to-date.
- **test-unit**: Executes unit tests using Bun.
- **test-browser**: Runs browser-based component tests using Vitest.
- **build**: Creates production build and uploads artifacts.
- **e2e**: Downloads build artifacts and runs Playwright E2E tests.
- **deploy**: Automatically deploys to Cloudflare using Wrangler after successful builds.

## Dependabot

This repository uses [Dependabot](https://docs.github.com/en/code-security/dependabot) to keep dependencies secure and up to date. Dependabot automatically creates pull requests for:

- JavaScript/TypeScript dependencies managed by Bun
- GitHub Actions workflows

These pull requests ensure that the project remains secure and compatible with the latest stable versions of its dependencies. Configuration for Dependabot is stored in `.github/dependabot.yml`.

## Code Owners

A `.github/CODEOWNERS` file is included to define responsibility for reviewing and approving changes. Pull requests affecting specific parts of the repository automatically request reviews from designated owners.

This ensures that domain experts review relevant changes, maintaining code quality and project consistency.

- Code owners are automatically added as reviewers on PRs that touch their designated files or directories.
- Merging a pull request typically requires approval from at least one code owner (depending on repository settings).

## Scripts

Summary of `bun run` scripts defined in `package.json`.

### Development & Build

| Script      | Description                                              |
| :---------- | :------------------------------------------------------- |
| `build`     | Builds the application for production deployment.        |
| `dev`       | Starts the development server with hot module reloading. |
| `start`     | Serves the built production application locally.         |
| `start:dev` | Starts Vite development server.                          |
| `preview`   | Previews the production build locally using Wrangler.    |
| `deploy`    | Placeholder for deployment logic.                        |
| `dev:cf`    | Starts a local Cloudflare Workers development server.    |

### Testing

| Script                  | Description                                         |
| :---------------------- | :-------------------------------------------------- |
| `test:unit`             | Runs unit tests in watch mode using Vitest.         |
| `test:unit:run`         | Runs unit tests once using Vitest.                  |
| `test:browser`          | Runs browser-based component tests via Vitest.      |
| `test:browser:run`      | Runs browser-based component tests once.            |
| `test:e2e`              | Runs Playwright E2E tests against preview server.   |
| `test:e2e:ui`           | Opens Playwright UI for interactive E2E testing.    |
| `test:e2e:dev`          | Runs E2E tests against development server.          |
| `test:e2e:dev:ui`       | Opens Playwright UI with development configuration. |
| `test:install:browsers` | Installs Playwright browser binaries (Chromium).    |
| `test:install:deps`     | Installs OS dependencies for Playwright browsers.   |

### Code Quality & Formatting

| Script            | Description                                          |
| :---------------- | :--------------------------------------------------- |
| `check:format`    | Checks code formatting with Prettier.                |
| `fix:format`      | Automatically fixes formatting issues with Prettier. |
| `check:lint`      | Runs all linters (ESLint and Oxlint).                |
| `fix:lint`        | Automatically fixes linting issues.                  |
| `fix:lint:eslint` | Automatically fixes issues (used by `fix:lint`).     |
| `fix:lint:oxlint` | Automatically fixes issues (used by `fix:lint`).     |
| `lint:eslint`     | Lints files with ESLint (used by `check:lint`).      |
| `lint:oxlint`     | Lints files with Oxlint (used by `check:lint`).      |
| `check:types`     | Validates TypeScript types across the project.       |
| `lighthouse`      | Runs Lighthouse performance audits.                  |

### Cloudflare & Type Generation

| Script           | Description                                              |
| :--------------- | :------------------------------------------------------- |
| `cf-typegen`     | Generates TypeScript types for Cloudflare configuration. |
| `check:typegen`  | Verifies Cloudflare types are up-to-date.                |
| `postcf-typegen` | Post-generation check for outdated types.                |
| `wrangler`       | Direct access to Wrangler CLI.                           |

## Deployment

For comprehensive deployment information, environment management, and rollback procedures, see [Deployment Guide](docs/deployment.md)
