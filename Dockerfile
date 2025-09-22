FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile || npm ci


FROM deps AS build
COPY . .
RUN pnpm build || npm run build


FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json .
EXPOSE 4000
CMD ["node", "dist/main.js"]