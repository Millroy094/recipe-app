import { InputType, Field, ID, ObjectType, ArgsType } from "type-graphql";

@ObjectType()
class Ingredients {
  @Field()
  name: string;
  @Field()
  measure: string;
  @Field()
  unit: string;
}

@ObjectType()
export class Recipe {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field((type) => [Ingredients])
  ingredients: Ingredients[];

  @Field((type) => [String])
  ingredientNames: String[];

  @Field((type) => [String])
  steps: string[];
}

@InputType()
class IngredientInput {
  @Field()
  name: string;
  @Field()
  measure: string;
  @Field()
  unit: string;
}
@InputType()
export class RecipeInput {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field(() => [IngredientInput])
  ingredients: IngredientInput[];
  @Field(() => [String])
  steps: string[];
}

@ArgsType()
export class RecipeFilters {
  @Field({ nullable: true })
  search?: string;

  @Field(() => [String], { nullable: true })
  ingredients?: string[];
}
