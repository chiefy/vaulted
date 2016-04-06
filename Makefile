VERSION := $(shell jq .version package.json)
DOCKER_MACHINE_HOST := "docker-host"
DOCKER_COMPOSE_TEST := "docker-compose-test.yml"
DOCKER_MACHINE_IP := $(shell docker-machine ip $(DOCKER_MACHINE_HOST))

.PHONY: clean build stop-local test

node_modules:
	@npm install

test: node_modules
	@docker-compose -f $(DOCKER_COMPOSE_TEST) up

logs:
	@docker-compose -f $(DOCKER_COMPOSE_TEST) logs

stop-local:
	@docker-compose -f $(DOCKER_COMPOSE_TEST) stop && \
	docker-compose -f $(DOCKER_COMPOSE_TEST) rm -fv

