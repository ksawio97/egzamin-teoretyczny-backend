FROM node:20.14.0-alpine

WORKDIR /backend-app
COPY package.json .
RUN npm install
COPY . .
CMD npm start