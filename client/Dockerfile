FROM node:lts-alpine as build

WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx as production

COPY --from=build /client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]