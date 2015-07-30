VERSION := $(shell jq .version package.json)

.PHONY: clean build run-local

node_modules:
	@npm install

test: node_modules
	@mocha -R progress tests/**/*.js

test-watch: node_modules
	@mocha -G -R spec -w tests/**/*.js

run-local: node_modules
	@docker-compose rm -fv
	@docker-compose up
