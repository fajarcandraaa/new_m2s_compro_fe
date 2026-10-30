# syntax=docker/dockerfile:1
# Mind2Screen company profile — Next.js 15 standalone image.
#
# Build args (baked in at build time):
#   BACKEND_URL           Internal BE origin, e.g. http://be:8080. Used for the /api and /uploads
#                         rewrites (resolved at build) AND as the runtime default for server fetches.
#   NEXT_PUBLIC_SITE_URL  Public origin, e.g. https://mindtoscreen.com (canonical URLs, sitemap, OG).
#   NEXT_PUBLIC_GA_ID     GA4 Measurement ID (G-XXXX); empty disables analytics + its privacy line.
# Runtime env:
#   BACKEND_URL (optional override for server fetches), REVALIDATE_SECRET (required for /api/revalidate).

FROM node:22.23.4-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22.23.4-alpine AS builder
WORKDIR /app
ARG BACKEND_URL=http://be:8080
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_GA_ID=
ENV BACKEND_URL=$BACKEND_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The BE does not need to be reachable here: build-time fetch failures render fallbacks
# that regenerate at runtime (ISR, revalidate 300 s or on-demand revalidation).
RUN npm run build

FROM node:22.23.4-alpine AS runner
WORKDIR /app
ARG BACKEND_URL=http://be:8080
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    BACKEND_URL=$BACKEND_URL \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/robots.txt >/dev/null || exit 1
CMD ["node", "server.js"]
