From node:18-alpine as build
# by default root. we need it run COPY, npm commands
USER root
# place we will do rest of the stuffs
WORKDIR /app

# install package.json first so it get cached
COPY package*.json ./

RUN npm install 

# copy from repo to container
COPY . .
RUN npm run build

From node:18-alpine as server
USER root
WORKDIR /app
RUN npm install -g http-server

COPY --from=build /app/public /app

EXPOSE 8080

CMD ["http-server"]
