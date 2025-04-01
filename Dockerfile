# 第一阶段：构建阶段
FROM docker.io/library/node:lts-alpine AS builder

WORKDIR /beagle

# RUN npm i -g corepack@latest && corepack enable

RUN apk update && apk add --no-cache git

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 优先复制包管理文件以利用 Docker 缓存
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./

# 安装依赖（清理缓存）
RUN pnpm store prune && pnpm install --frozen-lockfile

# 复制源代码
COPY . .

RUN pnpm install --frozen-lockfile

# 构建项目
RUN pnpm build

# 第二阶段：运行阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /beagle/dist /usr/share/nginx/html

# 自定义 nginx 配置（按需取消注释）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
