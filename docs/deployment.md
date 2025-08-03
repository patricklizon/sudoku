# Deployment Guide

Complete guide for deploying the Sudoku application to Cloudflare Workers, including environment management and rollback procedures.

## Table of Contents

- [Overview](#overview)
- [Environments](#environments)
- [Deployment Process](#deployment-process)
- [Manual Deployment](#manual-deployment)
- [Rollback Procedures](#rollback-procedures)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Overview

The application uses a dual-environment deployment strategy with automatic CI/CD via GitHub Actions:

- **Production**: Deployed from `main` branch to `{project-name}.{workers-subdomain}.workers.dev`
- **Staging**: Deployed from PRs to `pr-{number}-{project-name}.{workers-subdomain}.workers.dev`

## Environments

### Production Environment

- **Trigger**: Push to `main` branch
- **URL**: `https://sudoku.{workers-subdomain}.workers.dev`
- **Configuration**: Uses default `wrangler.toml` settings
- **Variables**:
  - `DEPLOYMENT_ID`: `release-{commit-sha:0:7}`
  - `DEPLOYMENT_TIMESTAMP`: ISO 8601 timestamp
  - `DEPLOY_URL`: Production URL
  - `PULL_REQUEST_URL`: Empty

### Staging Environment

- **Trigger**: Pull request creation/update
- **URL**: `https://pr-{pr-number}-{project-name}.{workers-subdomain}.workers.dev`
- **Configuration**: Uses `env.staging` from `wrangler.toml`
- **Variables**:
  - `DEPLOYMENT_ID`: `staging-PR-{pr-number}-{commit-sha:0:7}`
  - `DEPLOYMENT_TIMESTAMP`: ISO 8601 timestamp
  - `DEPLOY_URL`: Staging URL
  - `PULL_REQUEST_URL`: GitHub PR URL

## Deployment Process

### Automatic Deployment (CI/CD)

The CI pipeline automatically handles deployments:

1. **Quality Checks**: Format, lint, types, and configuration validation
2. **Testing**: Unit tests, browser tests, and E2E tests
3. **Build**: Creates production artifacts
4. **Deploy**:
   - Production: Direct deployment to main worker
   - Staging: Preview deployment with PR-specific alias

### Required Secrets

Configure these in GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Workers:Edit permissions
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_WORKER_SUBDOMAIN`: Workers subdomain for URLs
- `CLOUDFLARE_APP_WORKER_NAME`: Project name for staging aliases

## Manual Deployment

### Prerequisites

Ensure you have:

- Nix and direnv installed and configured
- Dependencies installed: `bun install`
- Cloudflare credentials configured

### Production Deployment

```bash
# Build the application
bun run build

# Deploy to production
bun wrangler deploy \
  --var DEPLOYMENT_ID:manual-$(date +%s) \
  --var DEPLOYMENT_TIMESTAMP:$(date -u +"%Y-%m-%dT%H:%M:%SZ")
```

### Staging Deployment

```bash
# Build the application
bun run build

# Deploy to staging with preview alias
bun wrangler versions upload \
  --preview-alias staging-manual \
  --env staging \
  --var DEPLOYMENT_ID:staging-manual-$(date +%s) \
  --var DEPLOYMENT_TIMESTAMP:$(date -u +"%Y-%m-%dT%H:%M:%SZ")
```

### Development Preview

```bash
# Local development server
bun run dev

# Local Cloudflare Workers preview
bun run preview
```

## Rollback Procedures

### Quick Rollback (Wrangler CLI)

1. **List Recent Deployments**:

   ```bash
   bun wrangler deployments list
   ```

2. **Rollback to Previous Version**:

   ```bash
   # Rollback to specific version ID
   bun wrangler rollback [VERSION_ID]

   # Interactive rollback selection
   bun wrangler rollback
   ```

### Dashboard Rollback

1. Navigate to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages
2. Select the `sudoku` worker
3. Go to **Deployments** tab
4. Find the desired version and click **⋯** → **Rollback**

### Emergency Rollback Steps

1. Immediate Action:

   ```bash
   # Quick rollback to last known good deployment
   bun wrangler rollback
   ```

2. Verify Rollback:

   ```bash
   # Check current deployment
   bun wrangler deployments list --limit 1

   # Test the application
   curl -I https://sudoku.{workers-subdomain}.workers.dev
   ```

3. Monitor: Check application logs and metrics post-rollback

### Rollback Limitations

- **Version Limit**: Can only rollback to the 10 most recent versions
- **Binding Changes**: Cannot rollback if bindings (KV, D1, R2) were deleted between versions
- **Migration Blocks**: Durable Object migrations prevent rollbacks to pre-migration versions

## Monitoring

### Deployment Verification

After deployment, verify:

1. Deployment Variables:

   ```bash
   bun wrangler tail --format pretty
   ```

2. Version Information:
   ```bash
   bun wrangler deployments list --limit 1
   ```

### Cloudflare Analytics

Monitor via Cloudflare Dashboard:

- **Workers Analytics**: Request volume, error rates, CPU time
- **Real User Monitoring**: Performance metrics
- **Logs**: Runtime errors and console output

### Debug Commands

```bash
# View detailed deployment logs
bun wrangler tail --format pretty

# List all versions
bun wrangler versions list

# Get deployment details
bun wrangler deployments list --format json
```

---

**Note**: Always test changes in staging before deploying to production. The CI/CD pipeline provides multiple safety checks, but manual verification is recommended for critical changes.
