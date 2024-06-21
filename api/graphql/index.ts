import { buildSchemaSync } from "type-graphql";
import path from "path";

import RecipeResolver from "./recipe.resolver";

const schema = buildSchemaSync({
  emitSchemaFile:
    process.env.NODE_ENV !== "production"
      ? path.resolve(__dirname, "../schema.graphql")
      : false,

  resolvers: [RecipeResolver],
  validate: false,
});

export default schema;
