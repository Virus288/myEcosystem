#!make
composeUp:
	sudo -S docker-compose build \
 	&& sudo docker-compose --env-file ./.env up -d

prepare:
	npm install --prefix ./services/gateway \
	&& chmod +x .husky/pre-commit \
	&& npm run prepare
