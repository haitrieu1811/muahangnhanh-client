FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm i --force
RUN NODE_ENV=production npm run build

CMD [ "npm", "run", "start" ]