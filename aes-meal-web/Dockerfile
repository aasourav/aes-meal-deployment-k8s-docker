FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_BASE_URL="http://localhost:8080"
RUN yarn run build

FROM nginx:alpine
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY --from=builder /app/dist /usr/share/nginx/html
# COPY --from=builder /app/dist/index.html /usr/share/nginx/html/index.html.template
# RUN apk add --no-cache gettext

# ARG VITE_BASE_URL="localhost:8080"
# # ENV VITE_BASE_URL=${VITE_BASE_URL}
# ENV VITE_BASE_URL=${VITE_BASE_URL}

# COPY .docker/app/nginx/nginx.conf /etc/nginx/nginx.conf
# COPY .docker/app/nginx/conf.d/ /etc/nginx/conf.d/
# COPY .docker/app/entrypoint.sh /entrypoint.sh
# COPY .docker/app/nginx/init-scripts/ /docker-entrypoint.d/

# CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/index.html.template > /usr/share/nginx/html/index.html && exec nginx -g 'daemon off;'"]

EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

ARG VITE_BASE_URL="localhost:8080"
ENV VITE_BASE_URL=${VITE_BASE_URL}


COPY .docker/app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY .docker/app/nginx/conf.d/ /etc/nginx/conf.d/
COPY .docker/app/entrypoint.sh /entrypoint.sh
COPY .docker/app/nginx/init-scripts/ /docker-entrypoint.d/

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist ./
