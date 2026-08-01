# syntax=docker/dockerfile:1

# --- build stage: render VitePress to static HTML ---
FROM node:24-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
COPY main/package.json main/package.json
RUN npm ci --no-fund --no-audit
COPY . .
RUN npm run -w main docs:build

# --- runtime stage: serve static files with nginx ---
FROM nginx:1.28-alpine AS runtime
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/main/.vitepress/dist /usr/share/nginx/html
EXPOSE 80
