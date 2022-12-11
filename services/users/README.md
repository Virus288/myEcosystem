# My ecosystem - Gateway

## 1. How to start

### Install dependencies

```shell
npm install / yarn
```

### Prepare environment

```shell
npm run prepare / yarn prepare
chmod +x .husky/pre-commit
```

## 2. How to build

```shell
npm run build / yarn build
```

## 3. Useful information

### 3.1 Logs folder

#### Linux

```text
~/.cache/"package.json -> productName"/logs
```

#### Windows

```text
~/AppData/Roaming/"package.json -> productName"/logs
```

### Currently, logs are all being saved in generic folder called "EcoSystem" to easier manage them

### 3.2 Testing

#### All test currently are written using jest. You can run all tests or just type specific tests

#### Available targets

```text
yarn tests = runs all tests
yarn tests:e2e = runs 'end to end' tests
yarn tests:db = runs 'database' tests
yarn tests:unit = runs 'unit' tests
yarn test:watch = run tests in 'watch' mode
```

#### Alongside tests, this app have 'test mode' which will help you run e2e tests. You can find "fakeData.json" in tests folder. MongoDB will fill database with that data 
