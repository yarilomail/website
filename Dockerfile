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
# The current stable nginx line, by digest; dependabot proposes newer ones.
# nginx itself comes from nginx.org's packages, which apk upgrade does not touch.
FROM nginx:1.31-alpine@sha256:fed7e14be83cbd2661a75cdc5b872d936cf155d46c327084d30b8df19ae88d72 AS runtime
# The base's packages lag Alpine's security fixes between nginx releases.
RUN apk upgrade --no-cache && mkdir -p /etc/nginx/conf.d/robots
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
# A config the new nginx rejects fails the build, not the rollout.
RUN nginx -t
COPY --from=build /src/main/.vitepress/dist /usr/share/nginx/html
EXPOSE 80
