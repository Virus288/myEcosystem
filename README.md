# Backend controller

## This is backend controller make using SOA ( service-oriented architecture ). Each type of data get each own controller

## Index
```
1. How to start
2. Communication
```

## 1. How to start:

If you are planning on using docker-compose, you'll need to add `.env` file. You can edit `example.env` since it contains all variables required to start project

If you are not planning on using docker-compose, you can start each service manually. Each service contains `README` file with information, on how to start it 

## 2. Communication:

Communication is made using rabbitMQ. Each controller is connecting it redis and listening to information. Gateway receives external message, uses some basic validation and passes that message to each worker
