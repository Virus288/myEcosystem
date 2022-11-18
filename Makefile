#!make
composeUp:
	sudo -S docker-compose build \
 	&& sudo docker-compose up -d \
 	--env-file ./config/.env

prepare:
	npm instal --prefix ./services/gateway \
	&& chmod +x .husky/pre-commit
