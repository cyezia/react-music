FROM nginx:1.15

COPY build /etc/nginx/html
COPY conf /etc/nginx/conf.d