FROM alpine:latest

MAINTAINER Christopher "Chief" Najewicz <chief@beefdisciple.com>

RUN apk update && apk add nodejs

RUN npm update -g npm \
  && mkdir -p /var/local/vaulted

VOLUME /var/local/vaulted

EXPOSE 3000

CMD npm start
