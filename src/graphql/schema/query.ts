import { objectType } from "nexus";

const Query = objectType({
  name: "Query",
  definition(t) {
    t.string("apiVersion", {
      resolve(_parent, _args, _context) {
        return "0.2";
      },
    });
  },
});

export { Query };
