FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install yarn
RUN yarn install
COPY . .
RUN yarn run build
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]