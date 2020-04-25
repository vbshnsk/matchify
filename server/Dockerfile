FROM node:13.0.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN ["chmod", "+x", "/app/wait-for-it.sh"]

RUN npm i nodemon -g

EXPOSE 3000

CMD ["nodemon", "index.js"]