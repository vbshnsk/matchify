FROM node:13.0.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN ["chmod", "+x", "/app/wait-for-it.sh"]

EXPOSE 3000

CMD ["node", "index.js"]