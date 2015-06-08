
APP_NAME := "$(shell jq .name package.json)"
APP_VERSION := $(shell jq .version package.json)

DOCKER_USER = "chiefy"
DOCKER_TAG := $(DOCKER_USER)/$(APP_NAME):$(APP_VERSION)

.PHONY: clean build docker-build run-local

test:
	@mocha -R progress tests/**/*.js

test-watch:
	@mocha -G -R spec -w tests/**/*.js

clean:
	@-docker rm vaulted

docker-build: clean
	@docker build -t $(DOCKER_TAG) .

run-local: docker-build
	@echo $(DOCKER_TAG)
	@docker run -d -v "$(shell pwd):/var/local/vault" -p 80:3000 --name vaulted $(DOCKER_TAG)
