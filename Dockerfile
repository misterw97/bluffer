FROM node:12-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm i && npm run build -- --mode production && rm -rf node_modules

ENV NODE_ENV=production
RUN npm i --production

EXPOSE 3000
CMD [ "node", "server/index.js" ]
