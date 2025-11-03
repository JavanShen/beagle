# 第一阶段：构建阶段
FROM docker.io/library/node:lts-alpine AS builder

WORKDIR /beagle

# RUN npm i -g corepack@latest && corepack enable

RUN apk update && apk add --no-cache git

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 优先复制包管理文件以利用 Docker 缓存
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml app/.npmrc ./
COPY app/package.json ./app/
COPY server/package.json ./server/

# 安装依赖（清理缓存）
RUN pnpm store prune && pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建项目
RUN pnpm build

# 第二阶段：运行阶段
FROM docker.io/library/node:lts-alpine AS production

# 安装 pnpm 和 sqlite
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    apk add --no-cache sqlite

WORKDIR /beagle

# 复制服务端包管理文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json ./server/

# 只安装生产依赖
RUN pnpm install --frozen-lockfile --prod

# 复制构建产物
COPY --from=builder /beagle/app/dist ./app/dist
COPY --from=builder /beagle/server/dist ./server/dist

# 创建数据库目录并设置权限
RUN mkdir -p /beagle/data && chown -R node:node /beagle

# 切换到非root用户
USER node

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV FRONTEND_OUTPUT=/beagle/app/dist
ENV DB_PATH=/beagle/data/database.sqlite

# 启动服务端
CMD ["node", "server/dist/server/index.js"]
