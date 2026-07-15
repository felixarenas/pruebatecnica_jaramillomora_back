# --- Stage 1: Development ---
FROM node:24.14.1-alpine AS development

RUN apk add --no-cache bash

WORKDIR /var/node/app

COPY package*.json ./

COPY . .

RUN chmod +x /var/node/app/start_docker.sh

CMD ["bash", "/var/node/app/start_docker.sh"]

# --- Stage 2: Builder ---
FROM node:24.14.1-alpine AS builder

WORKDIR /var/node/app

COPY package*.json ./
COPY --from=development /var/node/app/node_modules ./node_modules
COPY . .

RUN npm run build

ENV NODE_ENV=production
RUN npm ci --only=production && npm cache clean --force

# --- Stage 3: Production ---
FROM node:24.14.1-alpine AS production

WORKDIR /var/node/app

COPY --from=builder /var/node/app/node_modules ./node_modules
COPY --from=builder /var/node/app/dist ./dist

EXPOSE 3050

CMD ["node", "dist/src/main.js"]
