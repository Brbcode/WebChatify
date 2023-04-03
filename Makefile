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

-include Makefile.local