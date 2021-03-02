# sondages-server
It is a little server app for creating basic poll. \
This app provides a graphql API using nodejs for creating a basic poll app. \
Docker is used to launch the app. The app needs a postgres database to run.
This app provides 3 endpoints : 
  - /graphql : A graphql endpoint
  - /subscriptions : An endpoint for using websocket with grahql ( using subscriptions )
  - /playground : A playground to test some graphql request ( only available in development )
  
  
There is a web client [here](https://github.com/towaanu/sondages-client)

# Development
In order to start the app with postgres and pgadmin, you can use this command : \
`docker-compose run -w /sondages --service-ports node_api /bin/sh`


This command will launch a postgresql database and adminer (http://localhost:5050)
You should have an access to a shell inside a nodejs container. You can start the app with `npm install && npm start`

`babel-node` is used in development to start the server. \
Once started, you can access a graphql playground here : http://localhost:3030/playground

# Production build
Since we are using typescript and babel, we need to create a production build before using the app in production. \
There is a Dockerfile (`prod_tools/Dockerfile`) creating a ready to use container to start the nodejs app. \
To create an image using the Dockerfile, you need to be at the root of the project and running : \
`docker build -t sondages:prod -f ./prod_tools/Dockerfile .`

There is also a `docker-compose.prod.yml` providing a template for deploying the app using docker-compose.
