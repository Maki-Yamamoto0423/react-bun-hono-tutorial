# ベースイメージ
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# フロントエンドビルド
FROM oven/bun:1 as frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile
COPY frontend/ ./
RUN bun run build

# バックエンド依存インストール
FROM base as backend-builder
WORKDIR /usr/src/app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# 本番イメージ
FROM base as production
WORKDIR /usr/src/app

# 本番環境にコピー
COPY package.json ./
COPY --from=backend-builder /usr/src/app/node_modules ./node_modules
COPY server/ ./server/

# フロントエンドのビルド成果物をコピー
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "run", "start"]