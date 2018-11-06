# JSProject-Back

Javascript Full Stack EPITECH Project

## Installation

```sh
$ npm install
```

## Developement run

You always need a mongo database running on `127.0.0.1:27017`.

```sh
$ npm run dev
```

## Production run

You always need a mongo database running on `127.0.0.1:27017`.

```sh
$ npm run build-prod && npm run prod
```

## Docker

You can also use docker to setup the project.

```sh
$ docker run -p 27017:27017 --name my-mongo-dev -d mongo
$ docker build -t jsproject-back .
$ docker run -p 4242:4242 -p 1337:1337 jsproject-back
```

You can also refer to the new repository https://github.com/SakiiR/LiveChat which is giving you a way to build the project in one command.
