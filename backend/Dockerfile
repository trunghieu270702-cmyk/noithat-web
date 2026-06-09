# Base image
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

# Install dependencies
RUN pnpm install --filter backend...

# Copy Prisma schema and generate client
COPY backend/prisma ./backend/prisma/
RUN cd backend && npx prisma generate

# Copy source code and build
COPY backend ./backend/
RUN cd backend && pnpm build

# Production image
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy production dependencies and built files
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/backend/package.json ./backend/
RUN pnpm install --filter backend... --prod

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/node_modules ./backend/node_modules

# Ensure uploads directory exists
RUN mkdir -p /app/backend/uploads

WORKDIR /app/backend

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
