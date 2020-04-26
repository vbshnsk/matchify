FROM node:13.0.0 as build

WORKDIR /app

COPY package*.json ./

ARG NODE_ENV

ENV NODE_ENV ${NODE_ENV}

RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi;

COPY . .

EXPOSE 8080

RUN npm build;

FROM nginx as production

COPY /nginx.conf /temp/prod.conf

RUN envsubst /app < /temp/prod.conf > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]