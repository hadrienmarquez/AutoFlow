FROM node:15-alpine

WORKDIR /usr/src/app

COPY ./package.json ./package.json

RUN apk add --no-cache chromium 
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

RUN npm install -g nodemon && \
    npm install

CMD [ "npm", "run", "dev" ]