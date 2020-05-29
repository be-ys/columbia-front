FROM node:latest as build-stage
MAINTAINER be-ys <architecture_entreprise@almerys.com>

RUN apt-get update && apt-get install -y openjdk-8-jre openjdk-8-jdk maven git

RUN git clone https://github.com/be-ys/columbia-front.git /compil && cd /compil
WORKDIR /compil/front
COPY .env .env
RUN npm install
RUN npm run build 

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /compil/front/dist /app
COPY nginx.conf /etc/nginx/nginx.conf