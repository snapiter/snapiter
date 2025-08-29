FROM node:20-alpine

WORKDIR /opt/service

RUN npm install express compression helmet https @aws-sdk/client-s3 @aws-sdk/lib-storage

COPY ./server/ /opt/service/server/
COPY ./server.js /opt/service

EXPOSE 5000

ENTRYPOINT ["node", "server.js"]
