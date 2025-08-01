# Sudoku &middot;

Web app based on SolidStart, Solid.js, and Vinxi, powered by a Nix-based development environment.

## Table of content

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Stack](#stack)
- [Testing](#testing)
- [CI](#ci)
- [Scripts](#scripts)

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

This project employs a comprehensive testing strategy to ensure reliability and maintainability.
Tests are categorized and implemented using the following tools:

// TODO: add details on unit, components, mocking, e2e simulator with cloudflare mini

For detailed commands to run tests locally, refer to the [Testing Scripts](#testing-scripts) section.

## CI

The project uses GitHub Actions for Continuous Integration, defined in `.github/workflows/ci.yml`.
The CI pipeline ensures code quality, functionality, and successful builds on every pull request and push to the `main` branch.

The CI workflow includes the following stages:

- **Install Dependencies**: Installs project dependencies using Bun, leveraging caching for `node_modules` to speed up subsequent runs.
- **Install Browsers**: Installs necessary Playwright browser binaries (Chromium) for E2E tests, also utilizing caching.
- **Code Quality Checks**:
  - **Format Check**: Ensures code adheres to Prettier formatting rules (`bun run check:format`).
  - **Type Check**: Verifies TypeScript types (`bun run check:types`).
- **Unit Tests**: Runs all unit tests (`bun run test:unit`) to validate individual components and logic.
- **Build**: Creates a production-ready build of the application (`bun run build`). The build artifacts are uploaded for subsequent steps and potential deployment.
- **End-to-End (E2E) Tests**: Executes Playwright E2E tests (`bun run test:e2e`) against the built application to ensure core user flows are working correctly. Playwright test reports are uploaded as artifacts in case of failure.

// TODO: add auto deploy on merge to master

## Scripts

Summary of `bun run` scripts defined in `package.json`.

### Development & Deployment

| Script             | Description                                                                                 |
| :----------------- | :------------------------------------------------------------------------------------------ |
| `dev`              | Starts the development server with hot module reloading (`vinxi dev`).                      |
| `start`            | Serves the built production application locally (`vinxi start`).                            |
| `build`            | Builds the application for production deployment.                                           |
| `preview`          | Runs a local Cloudflare Workers/Pages development server for previewing built applications. |
| `deploy`           | Placeholder for actual deployment logic (requires server adapter).                          |
| `dev:cf`           | Starts a local Cloudflare Workers/Pages development server.                                 |
| `cf-typegen`       | Generates types for Cloudflare Workers/Pages configuration.                                 |
| `install-browsers` | Installs Playwright browser binaries (Chromium) required for E2E tests.                     |

### Testing Scripts

| Script             | Description                                                                |
| :----------------- | :------------------------------------------------------------------------- |
| `test`             | Runs a combination of browser and unit tests as configured in Vitest.      |
| `test:unit`        | Runs unit tests.                                                           |
| `test:unit:run`    | Runs unit tests explicitly for the `unit` project.                         |
| `test:unit:watch`  | Runs unit tests in watch mode.                                             |
| `test:browser`     | Runs browser-specific tests.                                               |
| `test:browser:run` | Runs browser-specific tests explicitly for the `browser` project.          |
| `test:e2e`         | Runs end-to-end tests using Playwright.                                    |
| `test:e2e:ui`      | Runs end-to-end tests with Playwright's UI mode for interactive debugging. |
| `test:e2e:dev`     | Runs end-to-end tests against a development server configuration.          |
| `test:e2e:dev:ui`  | Runs end-to-end tests against a development config with Playwright's UI.   |

### Checks & Linting

| Script         | Description                                                                                            |
| :------------- | :----------------------------------------------------------------------------------------------------- |
| `check:types`  | Validates TypeScript types across the project (`tsc --noEmit`).                                        |
| `check:format` | Checks code formatting using Prettier (`prettier --check .`).                                          |
| `check:lint`   | Runs both ESLint and Oxlint for static code analysis (`run-s lint:*`).                                 |
| `lighthouse`   | Runs Lighthouse CI for performance, accessibility, and best practices audits on the built application. |

### Formatting & Linting Fixes

| Script       | Description                                                                 |
| :----------- | :-------------------------------------------------------------------------- |
| `fix:format` | Attempts to automatically fix code formatting issues using Prettier.        |
| `fix:lint`   | Attempts to automatically fix linting issues reported by ESLint and Oxlint. |
