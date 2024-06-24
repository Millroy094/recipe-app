import "reflect-metadata";
import schema from "./index";
import { graphql, GraphQLArgs } from "graphql";
import { RecipeModel } from "../models";

const recipes = [
  {
    id: "test1",
    name: "test1",
    ingredients: [{ name: "onion", measure: "1", unit: "qty" }],
    ingredientNames: ["onion"],
    steps: ["Cut the onion"],
  },
  {
    id: "test2",
    name: "test2",
    ingredients: [{ name: "tomato", measure: "1", unit: "qty" }],
    ingredientNames: ["tomato"],
    steps: ["Cut the tomato"],
  },
];

describe("Get all recipes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const query = `
        query getRecipes($search: String, $ingredients: [String!]) {
            getRecipes(search: $search, ingredients: $ingredients) {
            id
            name
            ingredientNames
            }
          }
        `;

  it("should error when there is an issue getting the data", async () => {
    jest.spyOn(RecipeModel, "scan").mockImplementationOnce(() => {
      throw new Error("Random Error");
    });

    const response: any = await graphql({
      schema,
      source: query,
    } as GraphQLArgs);
    expect(response.errors[0].message).toBe("Unable to retrieve recipes.");
  });

  it("should not return any data if data isn't present", async () => {
    jest.spyOn(RecipeModel, "scan").mockImplementationOnce((): any => ({
      exec: (): any => ({ toJSON: (): any => [] }),
    }));

    const response: any = await graphql({
      schema,
      source: query,
    } as GraphQLArgs);
    expect(response.data.getRecipes).toEqual([]);
  });

  it("should return all recipes if present", async () => {
    const expectedResult = recipes.map((recipe) => ({
      id: recipe.id,
      name: recipe.name,
      ingredientNames: recipe.ingredientNames,
    }));
    jest.spyOn(RecipeModel, "scan").mockImplementationOnce((): any => ({
      exec: (): any => ({ toJSON: (): any => expectedResult }),
    }));

    const response: any = await graphql({
      schema,
      source: query,
    } as GraphQLArgs);

    expect(response.data.getRecipes).toMatchObject(expectedResult);
  });

  it("should return recipes matching the recipe name", async () => {
    const searchRecipeName = "test1";
    const expectedResult = [
      {
        id: recipes[0].id,
        name: recipes[0].name,
        ingredientNames: recipes[0].ingredientNames,
      },
    ];
    jest.spyOn(RecipeModel, "scan").mockImplementationOnce((): any => ({
      exec: (): any => ({
        toJSON: (): any =>
          recipes.filter((recipe) => recipe.name.includes(searchRecipeName)),
      }),
    }));

    const response: any = await graphql({
      schema,
      source: query,
      variableValues: { search: searchRecipeName },
    } as GraphQLArgs);

    expect(response.data.getRecipes.length).toBe(expectedResult.length);
    expect(response.data.getRecipes).toMatchObject(expectedResult);
  });

  it("should return recipes matching the ingredients selected", async () => {
    const searchIngredients = ["tomato"];
    const expectedResult = [
      {
        id: recipes[1].id,
        name: recipes[1].name,
        ingredientNames: recipes[1].ingredientNames,
      },
    ];
    jest.spyOn(RecipeModel, "scan").mockImplementationOnce((): any => ({
      exec: (): any => ({
        toJSON: (): any => recipes,
      }),
    }));

    const response: any = await graphql({
      schema,
      source: query,
      variableValues: { ingredients: searchIngredients },
    } as GraphQLArgs);

    expect(response.data.getRecipes.length).toBe(expectedResult.length);
    expect(response.data.getRecipes).toMatchObject(expectedResult);
  });
});

describe("Get recipe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const query = `
    query getRecipe($recipeId: String!) {
      getRecipe(recipeId: $recipeId) {
        id
        name
        ingredients {
          name
          measure
          unit
        }
        steps
      }
    }
    `;

  it("should error when there is an issue getting the recipe", async () => {
    jest.spyOn(RecipeModel, "get").mockImplementationOnce(() => {
      throw new Error("Random Error");
    });

    const response: any = await graphql({
      schema,
      source: query,
      variableValues: { recipeId: "test1" },
    } as GraphQLArgs);
    expect(response.errors[0].message).toBe("Unable to retrieve recipe.");
  });

  it("should error when recipe is not found", async () => {
    jest
      .spyOn(RecipeModel, "get")
      .mockImplementationOnce((id) =>
        recipes.find((recipe) => recipe.id === id)
      );

    const response: any = await graphql({
      schema,
      source: query,
      variableValues: { recipeId: "test3" },
    } as GraphQLArgs);
    expect(response.errors[0].message).toBe("Unable to retrieve recipe.");
  });

  it("should delete recipe without error", async () => {
    jest
      .spyOn(RecipeModel, "get")
      .mockImplementationOnce((id) =>
        recipes.find((recipe) => recipe.id === id)
      );

    const response: any = await graphql({
      schema,
      source: query,
      variableValues: { recipeId: recipes[0].name },
    } as GraphQLArgs);

    expect(response.data.getRecipe).toEqual({
      id: recipes[0].id,
      name: recipes[0].name,
      ingredients: recipes[0].ingredients,
      steps: recipes[0].steps,
    });
  });
});

describe("Create recipe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mutation = `
    mutation addRecipe($recipeInput: RecipeInput!) {
      addRecipe(recipeInput: $recipeInput)
    }
    `;

  const recipeToCreate = {
    id: recipes[0].id,
    name: recipes[0].name,
    ingredients: recipes[0].ingredients,
    steps: recipes[0].steps,
  };

  it("should error when there is an issue deleting the data", async () => {
    jest.spyOn(RecipeModel, "create").mockImplementationOnce(() => {
      throw new Error("Random Error");
    });

    const response: any = await graphql({
      schema,
      source: mutation,
      variableValues: {
        recipeInput: recipeToCreate,
      },
    } as GraphQLArgs);
    expect(response.errors[0].message).toBe("Unable to create recipe.");
  });

  it("should update recipe without error", async () => {
    jest.spyOn(RecipeModel, "create").mockImplementationOnce(() => ({}));

    const response: any = await graphql({
      schema,
      source: mutation,
      variableValues: { recipeInput: recipeToCreate },
    } as GraphQLArgs);

    expect(response.data.addRecipe).toBe(true);
  });
});

describe("Update recipe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mutation = `
    mutation updateRecipe($recipeInput: RecipeInput!) {
      updateRecipe(recipeInput: $recipeInput)
    }
    `;

  const recipeToUpdate = {
    id: recipes[0].id,
    name: recipes[0].name,
    ingredients: recipes[0].ingredients,
    steps: recipes[0].steps,
  };

  it("should error when there is an issue deleting the data", async () => {
    jest.spyOn(RecipeModel, "update").mockImplementationOnce(() => {
      throw new Error("Random Error");
    });

    const response: any = await graphql({
      schema,
      source: mutation,
      variableValues: {
        recipeInput: recipeToUpdate,
      },
    } as GraphQLArgs);
    expect(response.errors[0].message).toBe("Unable to update recipe.");
  });

  it("should update recipe without error", async () => {
    jest.spyOn(RecipeModel, "update").mockImplementationOnce(() => ({}));

    const response: any = await graphql({
      schema,
      source: mutation,
      variableValues: { recipeInput: recipeToUpdate },
    } as GraphQLArgs);

    expect(response.data.updateRecipe).toBe(true);
  });
});

describe("Delete recipe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mutation = `
    mutation removeRecipe($recipeId: String!) {
      removeRecipe(recipeId: $recipeId)
    }
    `;

  it("should error when there is an issue deleting the data", async () => {
    jest.spyOn(RecipeModel, "get").mockImplementationOnce(() => {
      throw new Error("Random Error");
    });

    const response: any = await graphql({
      schema,
      source: mutation,
      variableValues: { recipeId: "test1" },
    } as GraphQLArgs);
    expect(response.errors[0].message).toBe("Unable to remove recipe.");
  });

  it("should error when recipe is not found", async () => {
    jest
      .spyOn(RecipeModel, "get")
      .mockImplementationOnce((id) =>
        recipes.find((recipe) => recipe.id === id)
      );

    const response: any = await graphql({
      schema,
      source: mutation,
      variableValues: { recipeId: "test3" },
    } as GraphQLArgs);
    expect(response.errors[0].message).toBe("Unable to remove recipe.");
  });

  it("should delete recipe without error", async () => {
    jest.spyOn(RecipeModel, "get").mockImplementationOnce(() => ({
      delete: (): void => {},
    }));

    const response: any = await graphql({
      schema,
      source: mutation,
      variableValues: { recipeId: "test1" },
    } as GraphQLArgs);

    expect(response.data.removeRecipe).toBe(true);
  });
});
