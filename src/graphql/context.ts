import { PrismaClient } from "@prisma/client";
import { Knex } from 'knex';

export interface Context {
  prisma: PrismaClient;
  knex: Knex;
}

function genContext(prismaClient: PrismaClient, knex: Knex): Context {
  return {
    prisma: prismaClient,
    knex,
  };
}

export { genContext };
