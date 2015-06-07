FROM alpine:latest

MAINTAINER Christopher "Chief" Najewicz <chief@beefdisciple.com>

RUN mkdir -p /var/local/vaulted

ADD . /var/local/vaulted

RUN apk update && apk add nodejs  && npm update -g npm

RUN npm rebuild --production

WORKDIR /var/local/vaulted

CMD npm start

