FROM node:20-alpine

WORKDIR /home/app

# Copy package.json and install dependencies
COPY ./app/package*.json ./

RUN npm install express@4

COPY ./app .


CMD ["node", "web-server.js"]