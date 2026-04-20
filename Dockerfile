# ======================== # 
# Estágio 1: Build.        #
# ======================== #
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run build

# ======================== # 
# Estágio 2: Dependências. #
# ======================== #
FROM node:24-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev --ignore-scripts

# ======================== # 
# Estágio 3: Produção.     #
# ======================== #
FROM node:24-alpine AS production

RUN apk add --no-cache tini
RUN addgroup -g 1001 -S vehicle && \
    adduser node vehicle

WORKDIR /opt/app

COPY --from=builder --chown=node:vehicle /app/dist ./dist
COPY --from=deps --chown=node:vehicle /app/node_modules ./node_modules
COPY --from=builder --chown=node:vehicle /app/package.json ./

USER node

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "dist/main"]