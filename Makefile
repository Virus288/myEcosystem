#!make
composeUp:
	sudo -S docker-compose build \
 	&& sudo docker-compose up -d \
 	--env-file ./config/.env

prepare:
	npm install --prefix ./services/gateway \
	&& chmod +x .husky/pre-commit \
	&& npm run prepare
