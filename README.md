# Cowin Vaccine Tracker Bot

## Overview

This is the Cowin vaccine tracker graphql server + Telegram bot. It is a nodejs Apollo server for deployment in a container.

## Pre-requisites to get vaccine slot availability details on telegram application

- Telegram application
- Typescript/Nodejs

## Setting up Telegram Bot

Few changes that you need to make in the code to start using your own bot.
- You need to get authorization token from @BotFather and replace your code in ```src/clients/telegram.ts``` file.
- Get district code for your district from cowin website [cowin](https://apisetu.gov.in/public/marketplace/api/cowin) and replace it in  ```src/services/center.ts``` file.
- Update your docker hub ```username``` under ```docker-build``` in ```package.json``` file. (For pushing image into docker hub)

## Run Locally as a Container

To build and run this in a docker container:

```sh
npm install
npm run build
npm run docker-build
npm run docker-run
```

Point your browser to [localhost:5001/graphql](http://localhost:5001/graphql) to use the GraphiQL
query interface.

## Run Locally

To run this locally

```sh
npm install
npm start
```

## Example Graphql Queries

```graphql
query getCenterDetails {
  centers {
    centerIdentifier
    name 
    sessions {
      id
      date
      availableCapacity
      ageLimit
      vaccineName
    }
    feeType
  }
}
```

```graphql
mutation sendMessageToBot {
  sendMessage {
    message
    status
  }
}
```