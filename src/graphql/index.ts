import * as allTypes from "./schema";
import path from "path";
import { makeSchema } from "nexus";

const schema = makeSchema({
  types: allTypes,
  shouldGenerateArtifacts: process.env.NODE_ENV === "development",
  outputs: {
    schema: path.join(__dirname, "..", "generated/schema.gen.graphql"),
    typegen: path.join(__dirname, "..", "generated/nexusTypes.gen.ts"),
  },
  contextType: {
    module: path.join(__dirname, "context.ts"),
    export: "Context",
  },
  sourceTypes: {
    modules: [],
    mapping: {
      DateTime: "Date",
      UUID: "string",
    },
  },
});

export { schema };
