FROM node:alpine
WORKDIR /app
COPY package*.json .
COPY ./services/ ./services/
COPY ./tsconfig.json ./tsconfig.json
RUN [ "npm", "install" ]
RUN [ "npm", "run", "--workspace", "services/", "build", "--if-present" ]
