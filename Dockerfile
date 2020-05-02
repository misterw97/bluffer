FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD [ "node", "server/index.js" ]