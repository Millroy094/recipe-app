import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Recipe, RecipeInput, RecipeFilters } from './recipe.type';

import { RecipeModel } from '../models';
import { GraphQLError } from 'graphql';
import { prepareRecipeInputForDb } from './utils';
import logger from '../logger';

interface filterCondition {
  name?: { contains: string };
}

@Resolver(Recipe)
export default class RecipeResolver {
  @Query(() => [Recipe])
  async getRecipes(
    @Args() { search, ingredients }: RecipeFilters,
  ): Promise<Record<string, any>[]> {
    try {
      const condition: filterCondition = {};

      if (search) {
        condition.name = { contains: search };
      }
      const queryResult = await RecipeModel.scan(condition).exec();
      const results = queryResult.toJSON();

      const resultsFilteredByIngredients =
        ingredients?.length > 0
          ? results.filter((result) =>
              ingredients.every((ingredient) =>
                result.ingredientNames.includes(ingredient),
              ),
            )
          : results;

      return resultsFilteredByIngredients;
    } catch (err) {
      logger.error(err.message);
      throw new GraphQLError('Unable to retrieve recipes.');
    }
  }

  @Query(() => Recipe)
  async getRecipe(@Arg('recipeId') recipeId: string): Promise<Recipe> {
    try {
      const recipe = await RecipeModel.get(recipeId);

      if (!recipe) {
        throw new Error("Recipe with that id doesn't exists");
      }

      const { id, name, steps, ingredients, ingredientNames } = recipe;
      return { id, name, steps, ingredients, ingredientNames };
    } catch (err) {
      logger.error(err.message);
      throw new GraphQLError('Unable to retrieve recipe.');
    }
  }

  @Mutation(() => Boolean)
  async addRecipe(
    @Arg('recipeInput') recipeInput: RecipeInput,
  ): Promise<boolean> {
    try {
      const serializedRecipeInput = prepareRecipeInputForDb({
        inputData: recipeInput,
      });
      await RecipeModel.create(serializedRecipeInput);
      return true;
    } catch (err) {
      logger.error(err.message);
      throw new GraphQLError('Unable to create recipe.');
    }
  }

  @Mutation(() => Boolean)
  async updateRecipe(
    @Arg('recipeInput') recipeInput: RecipeInput,
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
      logger.error(err.message);
      throw new GraphQLError('Unable to update recipe.');
    }
  }

  @Mutation(() => Boolean)
  async removeRecipe(@Arg('recipeId') recipeId: string): Promise<boolean> {
    try {
      const recipe = await RecipeModel.get(recipeId);

      if (!recipe) {
        throw new Error("Recipe with that id doesn't exists");
      }

      await recipe.delete();
      return true;
    } catch (err) {
      logger.error(err.message);
      throw new GraphQLError('Unable to remove recipe.');
    }
  }
}
