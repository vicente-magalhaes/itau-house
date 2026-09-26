# syntax=docker/dockerfile:1

# Imagem do front-end (React + Vite). Estágios:
#   deps        node_modules instalado a partir do package-lock.json.
#   dev         servidor do Vite com hot reload. É o que o docker-compose.yml usa.
#   build       gera o dist/ de produção.
#   production  nginx sem root servindo o dist/ e repassando /api ao back-end. É o que o
#               docker-compose.prod.yml usa.
#
# O contexto do build é a raiz do repo, não frontend/, porque o front importa ../design-system.
# O que entra no contexto está em frontend/Dockerfile.dockerignore (lista de permissão).
# O layout /app/frontend + /app/design-system repete o do repo, para os caminhos relativos valerem.

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-slim AS deps

WORKDIR /app/frontend

# Só os manifestos primeiro: a camada do npm ci fica em cache enquanto o código muda.
COPY frontend/package.json frontend/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci


FROM deps AS dev

COPY design-system/ ../design-system/
COPY frontend/ ./

EXPOSE 5173

HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=5 \
    CMD node -e "fetch('http://127.0.0.1:5173/').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"

# Roda como root de propósito: o código chega por volume montado e o Vite grava cache em node_modules.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


FROM dev AS build

RUN npm run build


FROM nginxinc/nginx-unprivileged:1.30-alpine AS production

# Destino do /api. O padrão é o serviço `backend` do compose. Em outro ambiente, trocar na subida.
ENV API_UPSTREAM=http://backend:8000

# A imagem do nginx aplica as variáveis de ambiente nos templates ao subir e grava em conf.d/.
COPY frontend/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
