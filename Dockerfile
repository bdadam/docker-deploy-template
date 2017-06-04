FROM node:7-alpine

RUN mkdir -p /app/src
RUN mkdir -p /app/data
WORKDIR /app

COPY package.json /app/

RUN yarn install

COPY ./src /app/src
COPY ./test /app/test

RUN npm test

EXPOSE 3000

CMD ["npm", "start"]