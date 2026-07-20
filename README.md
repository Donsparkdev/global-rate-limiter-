# Global Rate Limiter as a Service

A high-performance distributed API rate limiter built with TypeScript, Express.js, Redis, and Lua.

The service provides centralized rate limiting for multiple clients and API consumers while maintaining low latency and accurate limits across multiple application instances.

---

## Features

- Distributed rate limiting
- Redis-backed shared state
- Lua atomic sliding window algorithm
- Multi-client configurable limits
- API key authentication
- Request ID tracing
- Structured logging
- Health monitoring
- Metrics endpoint
- Docker support
- Fail-safe Redis handling

---

## Architecture
Fail-safe Redis handling

---

## Architecture
Client Request

                   |
                   v

          Express API Gateway

                   |
                   v

        Rate Limiter Middleware

          /                  \

         v                    v

 API Key Validation       Redis Lua Script

                                |

                                v

                          Redis Storage

                                |

                                v

                     Usage Metrics + Logs
---

## Technology Stack

- Node.js
- TypeScript
- Express.js
- Redis
- Lua scripting
- Pino Logger
- Docker

---

## How It Works

Each client receives a configured request limit.

Example:
Client A 100 requests/minute
Client B 5000 requests/minute

The Lua script executes atomically inside Redis ensuring accurate counting even when multiple service instances are running.

---

## Project Structure

src ├── config │   └── redis.ts ├── middleware │   ├── rateLimiter.ts │   └── requestId.ts ├── services │   └── limiter │       └── luaLimiter.ts ├── lua │   └── slidingWindow.lua ├── logger.ts └── index.ts

---

# Installation

```bash
git clone https://github.com/Donsparkdev/global-rate-limiter-

cd global-rate-limiter

npm install

# Environment

Create .env

PORT=3000
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info

# Running

Start Redis:

redis-server


Start application:

npm run dev

# Docker

Run:

docker compose up --build

# API

Health Check

GET /health

Example response:

{
 "status":"OK",
 "redis":"connected"
}

# Metrics

GET /metrics

Example

{
 "activeClients":2,
 "redis":true
}

# Protected API

GET /api/test

Header:

x-api-key: clientA

Response:

{
 "message":"Request accepted"
}

When limit is exceeded:

429 Too Many Requests

# Logging

Every approved request includes:
Request ID
Client ID
Endpoint
HTTP method
Remaining quota

Example:

INFO:
{
 requestId:"7d8c...",
 client:"clientA",
 endpoint:"/api/test",
 remaining:4
}

# Fail Safe Strategy

If Redis becomes temporarily unavailable:
The service detects connection failure.
Requests are handled according to fallback policy.
The API remains available.

# Future Improvements

PostgreSQL + Prisma client management
Admin dashboard
Usage analytics
Prometheus metrics
Automated load testing
Kubernetes deployment

# Author

Donsparkdev
