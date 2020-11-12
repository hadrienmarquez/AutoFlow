FROM node:15-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache chromium 
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

COPY ./package.json ./package.json

RUN npm install -g nodemon && \
    npm install

CMD [ "npm", "run", "dev" ]