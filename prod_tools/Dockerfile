# build
FROM node:alpine AS build

COPY package.json /sondages/ 
COPY ./src /sondages/src
COPY ./migrations /sondages/migrations
COPY tsconfig.json /sondages/
COPY babel.config.json /sondages/

WORKDIR /sondages

RUN npm install

ENV NODE_ENV=production

RUN npm run build
RUN npm run build:migrations

# release image
FROM node:alpine

ENV NODE_ENV=production

COPY --from=build /sondages/dist /app/dist
COPY --from=build /sondages/package.json /app/

COPY --from=build /sondages/dist_migrations /app/migrations
COPY knexfile.ts /app/
COPY prod_tools/entrypoint.sh /app/

RUN apk update
RUN apk add postgresql-client

WORKDIR /app

RUN npm install

RUN chmod +x ./entrypoint.sh

CMD ./entrypoint.sh
