FROM alpine:latest

MAINTAINER Christopher "Chief" Najewicz <chief@beefdisciple.com>

ENV WORKDIR=/usr/local/vault

RUN apk update && apk add nodejs

RUN npm update -g npm \
  && mkdir -p $WORKDIR

WORKDIR $WORKDIR

VOLUME $WORKDIR

EXPOSE 3000

CMD npm start
