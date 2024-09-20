FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_BASE_URL="http://localhost:8080"
RUN yarn run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/dist/index.html /usr/share/nginx/html/index.html.template
RUN apk add --no-cache gettext
ENV VITE_BASE_URL="http://localhost:8080"

CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/index.html.template > /usr/share/nginx/html/index.html && exec nginx -g 'daemon off;'"]

EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
