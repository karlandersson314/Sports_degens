# Sports Degens (Startup)

Backend API for Sports Degens (sports betting tools + sweepstakes casino).

## Quick start

1) Install deps
```bash
npm i
```

2) Configure env
```bash
cp env.example .env
```

3) Run
```bash
npm run dev
```

Health: `GET /health`

## API
- Auth: `/api/auth`
- Sports tools: `/api/sports-tools` (requires tools access)
- Casino: `/api/casino` (in progress)
- Payment: `/api/payment` (Stripe subscription for tools)

