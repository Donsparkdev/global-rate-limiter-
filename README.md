# Global Rate Limiter

A distributed API rate limiter built with **TypeScript**, **Express.js**, **Redis**, and **Lua**.

## Features

- Distributed rate limiting
- Sliding Window algorithm using Redis Lua scripts
- API Key authentication
- Configurable rate limits
- Express middleware
- Health endpoint
- Metrics endpoint
- Structured logging with Pino
- Redis-backed state
- Production-ready architecture

## Tech Stack

- TypeScript
- Express.js
- Redis
- Lua
- Pino
- Node.js

## Project Structure

```
src/
├── config/
├── middleware/
├── services/
│   ├── limiter/
│   └── clientService.ts
├── lua/
├── logger.ts
├── index.ts
```

## Installation

```bash
git clone https://github.com/Donsparkdev/global-rate-limiter-.git

cd global-rate-limiter

npm install
```

## Environment Variables

Create a `.env` file.

```env
PORT=3000
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
```

## Running

Start Redis

```bash
redis-server
```

Start the API

```bash
npm run dev
```

## API

### Health

```
GET /health
```

### Metrics

```
GET /metrics
```

### Protected Endpoint

```
GET /api/test
```

Headers

```
x-api-key: clientA
```

Response

```json
{
  "message": "Request accepted"
}
```

After exceeding the configured request limit

```json
{
  "message": "Rate limit exceeded"
}
```

## Architecture

```
Client
   │
   ▼
Express Server
   │
   ▼
Rate Limiter Middleware
   │
   ├─────────────┐
   ▼             ▼
API Key      Lua Script
Validation   Sliding Window
      │          │
      └──────┬───┘
             ▼
           Redis
             │
             ▼
     Metrics & Logging
```

## Future Improvements

- PostgreSQL + Prisma
- Dashboard
- Swagger/OpenAPI
- Prometheus metrics
- GitHub Actions CI/CD

## Author

**Donsparkdev**
