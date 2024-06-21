import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import { Recipe, RecipeInput, RecipeFilters } from "./recipe.type";

import { RecipeModel } from "../models";
import { GraphQLError } from "graphql";
import { prepareRecipeInputForDb } from "./utils";

interface filterCondition {
  name?: { contains: string };
  ingredientNames?: { in: string[] };
}

@Resolver(Recipe)
export default class RecipeResolver {
  @Query(() => [Recipe])
  async getRecipes(
    @Args() { search, ingredients }: RecipeFilters
  ): Promise<Record<string, any>[]> {
    try {
      const condition: filterCondition = {};

      if (search) {
        condition.name = { contains: search };
      }

      if (ingredients?.length > 0) {
        condition.ingredientNames = { in: ingredients };
      }

      const queryResult = await RecipeModel.scan(condition).exec();

      return queryResult.toJSON();
    } catch (err) {
      console.log(err);
      throw new GraphQLError("Unable to retreive recipes.");
    }
  }
  @Mutation(() => Boolean)
  async addRecipe(
    @Arg("recipeInput") recipeInput: RecipeInput
  ): Promise<boolean> {
    try {
      const serializedRecipeInput = prepareRecipeInputForDb({
        inputData: recipeInput,
      });
      await RecipeModel.create(serializedRecipeInput);
      return true;
    } catch (err) {
      console.log(err);
      throw new GraphQLError("Unable to create recipe.");
    }
  }

  @Mutation(() => Boolean)
  async updateRecipe(
    @Arg("recipeInput") recipeInput: RecipeInput
  ): Promise<boolean> {
    try {
      const { id } = recipeInput;

      const serializedRecipeInput = prepareRecipeInputForDb({
        inputData: recipeInput,
        withoutIndex: true,
      });

      await RecipeModel.update(id, serializedRecipeInput);
      return true;
    } catch (err) {
      console.log(err);
      throw new GraphQLError("Unable to update recipe.");
    }
  }

  @Mutation(() => Boolean)
  async removeRecipe(@Arg("recipeId") recipeId: string): Promise<boolean> {
    try {
      const recipe = await RecipeModel.get(recipeId);
      await recipe.delete();
      return true;
    } catch (err) {
      console.log(err);
      throw new GraphQLError("Unable to remove recipe.");
    }
  }
}
