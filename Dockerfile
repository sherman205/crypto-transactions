FROM node:carbon
WORKDIR /usr/src/app

ENV PORT 3000

COPY package*.json ./

RUN npm install
COPY . .

CMD ["npm", "start"]
