DOCKER_CMD = do-co

up:
	$(DOCKER_CMD) up -d

down:
	$(DOCKER_CMD) stop

rebuild:
	$(DOCKER_CMD) down -v --remove-orphans
	$(DOCKER_CMD) rm -vsf
	$(DOCKER_CMD) up -d --build

bash:
	$(DOCKER_CMD) exec app bash

watch:
	$(DOCKER_CMD) exec app "yarn run watch"

db:
	$(DOCKER_CMD) exec app "php bin/console doctrine:database:drop --if-exists --force"
	$(DOCKER_CMD) exec app "php bin/console doctrine:database:create"
	$(DOCKER_CMD) exec app "php bin/console doctrine:migrations:migrate -n"
	$(DOCKER_CMD) exec app "php bin/console hau:fix:load -n"

db-test:
	$(DOCKER_CMD) exec app "php bin/console doctrine:database:drop --if-exists --force --env=test"
	$(DOCKER_CMD) exec app "php bin/console doctrine:database:create --env=test"
	$(DOCKER_CMD) exec app "php bin/console doctrine:migrations:migrate -n --env=test"
	$(DOCKER_CMD) exec app "php bin/console hau:fix:load -n --env=test"

init:
	@echo "###> Composer Install ###"
	$(DOCKER_CMD) exec app "composer install"
	@echo "###< Composer Install ###"
	@echo
	@echo "###> Yarn Install ###"
	$(DOCKER_CMD) exec app "yarn install"
	@echo 'Building... (can take few minutes)'
	$(DOCKER_CMD) exec app "yarn run build"
	@echo "###< Yarn Install ###"
	@echo
#	@echo "###> Hooks Install ###"
#	$(DOCKER_CMD) exec app "cp .docker/hooks/pre-commit .git/hooks/pre-commit"
	@echo "###< Hooks Install ###"
	@echo
	@echo "###> Generate the SSL keys ###"
	$(DOCKER_CMD) exec app "php bin/console lexik:jwt:generate-keypair --skip-if-exists"
	@echo "###< Generate the SSL keys ###"

behat:
	$(eval args := $(filter-out $@,$(MAKECMDGOALS)))
	$(DOCKER_CMD) exec app "vendor/bin/behat $(args)"

behat-full:	db-test
	$(eval args := $(filter-out $@,$(MAKECMDGOALS)))
	$(DOCKER_CMD) exec app "vendor/bin/behat $(args)"

version:
	@echo -n "\033[32mPHP\033[0m version \033[33m"
	@echo -n "$(shell $(DOCKER_CMD) exec app php -v | awk '/^PHP/ {print substr($$2, 1, 3)}')"
	@echo "\033[0m"
	@echo "$(shell $(DOCKER_CMD) exec app composer -V)"
	@echo -n "\033[32mSymfony\033[0m version \033[33m"
	@echo -n "$(shell $(DOCKER_CMD) exec app php bin/console --version | grep -oP '\d+\.\d+\.\d+')"
	@echo "\033[0m"
	@echo -n "\033[32mNode\033[0m version \033[33m"
	@echo -n "$(shell $(DOCKER_CMD) exec app node -v)"
	@echo "\033[0m"
	@echo -n "\033[32mYarn\033[0m version \033[33m"
	@echo -n "$(shell $(DOCKER_CMD) exec app yarn -v)"
	@echo "\033[0m"

-include Makefile.local