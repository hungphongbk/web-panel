FROM node:10.6.0

COPY . /app

WORKDIR /app

RUN npm install

EXPOSE 8082 8081