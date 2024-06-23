FROM node:20.11

WORKDIR /usr/src/app/ui

COPY package*.json ./

RUN npm i

EXPOSE 3000

CMD ["npm", "start"]
