FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY .next ./.next

EXPOSE 3000

CMD [ "npm", "run", "dev" ]