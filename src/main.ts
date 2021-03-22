import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { schema } from "./graphql";
import { genContext } from "./graphql/context";
import { execute, subscribe } from "graphql";
import expressPlayground from "graphql-playground-middleware-express";
import {knexPg} from './db'

const server = express();

const prismaClient = new PrismaClient();

if (process.env.NODE_ENV === "development") {
  server.use(cors());
}

if (process.env.NODE_ENV === "production") {
  server.use(cors({
      origin: process.env.CORS_ORIGIN
  }));
}

server.get("/", (_req, res) => res.send("Hello world"));

server.use(
  "/graphql",
  graphqlHTTP((_req, _res, _graphQLParams) => {
    return {
      schema: schema,
      context: genContext(prismaClient, knexPg),
      graphiql: false,
    };
  })
);

if (process.env.NODE_ENV === "development") {
  server.get(
    "/playground",
    expressPlayground({
      endpoint: "/graphql",
      subscriptionEndpoint: `ws://localhost:${process.env.SERVER_PORT}/subscriptions`,
    })
  );
}

const ws = createServer(server);

ws.listen(process.env.SERVER_PORT, () => {
  console.log(`Server started at http://localhost:${process.env.SERVER_PORT}`);
  // Set up the WebSocket for handling GraphQL subscriptions.
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server: ws,
      path: "/subscriptions",
    }
  );
});
