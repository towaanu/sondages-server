import * as allTypes from "./models";
import { makeSchema } from "nexus";

const schema = makeSchema({
  types: allTypes,
});

export default schema;
