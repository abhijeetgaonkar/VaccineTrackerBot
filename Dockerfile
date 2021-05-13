FROM node:10-alpine

RUN apk update && apk upgrade && apk add --no-cache bash openssh

WORKDIR /opt/graphql-platform
COPY package*.json ./
RUN npm ci
COPY dist ./

ENV LISTEN_ADDR=0.0.0.0
ENV PORT=5000

EXPOSE 5000
ENTRYPOINT ["node", "src/index"]
