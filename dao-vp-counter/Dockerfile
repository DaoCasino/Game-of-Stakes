FROM node:10-alpine as builder

WORKDIR /app
COPY . .

RUN npm i

EXPOSE 3000

CMD ["npm", "start"]