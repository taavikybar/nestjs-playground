## Description

[Nest.js](https://github.com/nestjs/nest) + [MongoDB](https://www.mongodb.com/) + [Nats](https://nats.io/) playground using [nats.io](https://github.com/nats-io/nats.js)

## Installation

```bash
$ npm i
```

## Running the app

```bash
# start mongodb and nats containers
docker-compose up -d

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# to run run.ts
npx ts-node run.ts
```
