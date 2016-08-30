VERSION := $(shell jq .version package.json)

ifeq "" "$(DOCKER_MACHINE_NAME)"
	DOCKER_MACHINE_NAME := default
endif

DOCKER_MACHINE_IP := $(shell docker-machine ip $(DOCKER_MACHINE_NAME) 2> /dev/null)
TEST_ENV := docker

ifeq "" "$(DOCKER_MACHINE_IP)"
	DOCKER_MACHINE_IP := "127.0.0.1"
endif

.PHONY: clean build stop-local test start-vault stop-vault mocha-watch

node_modules:
	@npm install

docker-compose.yml:
	@cp compose-templates/test-$(TEST_ENV).yml $@

logs: docker-compose.yml
	@docker-compose logs

stop-vault: docker-compose.yml
	@docker-compose stop && docker-compose rm -fv

start-vault: docker-compose.yml
	@docker-compose up -d

test-docker: docker-compose.yml stop-vault node_modules
	@docker-compose up

test-local: TEST_ENV=local
test-local: node_modules stop-vault start-vault
	@sleep 5 && \
	echo $(DOCKER_MACHINE_IP) && \
	VAULT_HOST=$(DOCKER_MACHINE_IP) \
	VAULT_SSL=false \
	NODE_ENV=test \
	DEBUG=false \
	TEST_CONSUL_HOST=$(DOCKER_MACHINE_IP) \
	CONSUL_HOST=$(DOCKER_MACHINE_IP) \
	TEST_SYSLOG=true \
	ALLOW_CONFIG_MUTATIONS=true \
	./node_modules/.bin/_mocha --growl -R spec tests/**

clean:
	@rm -rf docker-compose.yml node_modules
