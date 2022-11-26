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