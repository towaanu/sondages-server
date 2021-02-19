import { PrismaClient } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
}

function genContext(prismaClient: PrismaClient): Context {
  return {
    prisma: prismaClient,
  };
}

export { genContext };
