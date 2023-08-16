FROM node:alpine
WORKDIR /app
COPY package*.json .
RUN [ "npm", "install" ]
COPY ./services/ ./services/
COPY ./tsconfig.json ./tsconfig.json
RUN [ "npm", "run", "--workspace", "./services/piperchat", "build" ]
