#!/bin/sh

# Replace the placeholders in config.js with environment variables
envsubst < /usr/share/nginx/html/config.js > /usr/share/nginx/html/config.js.tmp && mv /usr/share/nginx/html/config.js.tmp /usr/share/nginx/html/config.js

# Start nginx
nginx -g "daemon off;"
