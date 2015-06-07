
APP_NAME := "$(shell jq .name package.json)"
APP_VERSION := $(shell jq .version package.json)

DOCKER_USER = "chiefy"
DOCKER_TAG := $(DOCKER_USER)/$(APP_NAME):$(APP_VERSION)

.PHONY: clean build docker-build

docker-build:
	@docker build -t $(DOCKER_TAG) .

run-local:
	@docker rm vault
	@docker run -it -p 80:3000 --name vault $(DOCKER_TAG)