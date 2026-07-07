# ==============================================================================
# BrewAI Portfolio Prototype - Frontend Next.js Container Setup
# ==============================================================================

# Stage 1: Build Layer
FROM node:18-alpine AS builder
WORKDIR /workspace

COPY package.json ./
RUN npm install

COPY . .

# Build the optimized production application bundles
RUN npm run build

# Stage 2: Production Performance Layer
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Bring over only the required distribution directories to keep the image lean
COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/.next ./.next
COPY --from=builder /workspace/public ./public
COPY --from=builder /workspace/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]