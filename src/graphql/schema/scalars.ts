import { scalarType } from "nexus";
import { Kind } from "graphql";

const DateTimeScalar = scalarType({
  name: "DateTime",
  asNexusMethod: "datetime",
  description: "DateTime custom scalar type",
  parseValue(value: string | number) {
    return new Date(value);
  },
  serialize(value: Date) {
    return value.toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }

    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }

    return null;
  },
});

export { DateTimeScalar };
