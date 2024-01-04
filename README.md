## How to use

### Prerequisites

Install [Docker Desktop](https://docs.docker.com/get-docker) for Mac, Windows, or Linux. Docker Desktop includes Docker Compose as part of the installation.

### Development

## Install backend

```bash
$ cd backend
$ cp .env_default .env
$ pnpm install
$ pnpm start:init
$ cd ..
```

## Install frontend

```bash
$ cd app
$ pnpm install
$ cd ..
```

## Running the app

```bash
$ pnpm install
$ pnpm dev
```

### Run test E2E backend

```bash
$ cd backend
$ pnpm pretest:e2e
$ pnpm test:e2e
```
