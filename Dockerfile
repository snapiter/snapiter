FROM node:20-alpine

RUN mkdir -p /opt/service/dist
WORKDIR /opt/service

RUN npm install express compression helmet https @aws-sdk/client-s3 @aws-sdk/lib-storage @aws-sdk/node-http-handler querystring express-static-gzip

COPY ./dist /opt/service/dist
COPY ./server/ /opt/service/server/
COPY ./server.js /opt/service

EXPOSE 5000

ENTRYPOINT ["node", "server.js"]