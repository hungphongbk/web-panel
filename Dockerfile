FROM node:10.6.0

COPY package.json /app/package.json

RUN cd /app; npm install

COPY . /app

EXPOSE 8080 8081