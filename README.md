# Deploy Monorepo with CI/CD pipelines using GitHub Actions.

A barebones monorepo built to test and demonstrate end-to-end CI/CD deployment pipelines using GitHub Actions.

## What's inside?

### Apps
- **web**: Next.js frontend application
- **backend**: Node.js / Express backend server

### Packages
- **@repo/db**: Prisma ORM with PostgreSQL database models
- **@repo/ui**: Shared React component library
- **@repo/eslint-config**: Centralized ESLint configurations
- **@repo/typescript-config**: Shared TypeScript configurations

## CI/CD Pipeline

Automated deployments are powered by **GitHub Actions**:
1. **Build & Package**: Builds Docker images for the services on every push to `main`.
2. **Registry**: Pushes versioned tags (`${{ github.sha }}`) to **Docker Hub**.
3. **Deployment**: Connects via SSH to the target VM, pulls the fresh image, gracefully stops the running container, and launches the updated build.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js, Express (TypeScript)
- **Database**: PostgreSQL + Prisma ORM
- **Runtime & Package Manager**: Bun
- **Monorepo Tools**: Turborepo
- **CI/CD & DevOps**: GitHub Actions, Docker, Docker Hub, SSH Deployment

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (v1.0+)
- Docker (for containerized deployment)
- PostgreSQL

### Installation & Development
```bash
# Install dependencies
bun install

# Start all apps in development mode
bun dev

# Build all applications
bun run build
