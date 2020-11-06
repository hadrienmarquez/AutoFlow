FROM node:14-alpine

WORKDIR /usr/src/app

COPY ./package.json ./package.json

RUN npm install -g nodemon && \
    npm install

CMD [ "npm", "run", "dev" ]