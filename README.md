# Backend controller

## This is backend controller make using SOA ( service-oriented architecture ). Each type of data get each own controller

## Index

```
1. How to start
2. How to build
3. Communication
```

## 1. How to start:

If you are planning on using docker-compose, you'll need to add `.env` file. You can edit `example.env` since it
contains all variables required to start project

Otherwise, you can start each service manually. Each service contains `README` file with information, on how to start it

## 2. How to build

### 2.1 Automated way ( Does not work on windows by default )

```shell
make prepare
```

### 2.2 By hand

#### Install dependencies for husky

```shell
npm install
```

#### Install dependencies for each service

```shell
npm install --prefix ./services/gateway
npm install --prefix ./services/users
```

#### Prepare environment

```shell
npm run prepare
chmod +x .husky/pre-commit
```

## 3. Communication:

Communication is made using rabbitMQ. Each controller is connecting it and listening to information. Gateway
receives external message, uses some basic validation and passes that message to each worker

