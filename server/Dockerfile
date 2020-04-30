FROM node:13.0.0

WORKDIR /app

COPY package*.json ./

ARG NODE_ENV

ENV NODE_ENV ${NODE_ENV}

RUN if [ "$NODE_ENV" = "development" ]; \
    then npm i nodemon -g; \
    npm install; \
    else npm install --only=production; \
    fi;

COPY . .

RUN ["chmod", "+x", "/app/wait-for-it.sh"]

EXPOSE 3000

CMD ["node", "index.js"]