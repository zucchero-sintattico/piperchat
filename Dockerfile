FROM node:alpine
WORKDIR /app
COPY package*.json .
COPY ./services/ ./services/
RUN ["rm", "-rf", "services/*/dist"]
COPY ./tsconfig.json ./tsconfig.json
RUN [ "npm", "install" ]
