import {
  createRecipe,
  deleteRecipe,
  generateFakeRecipeObject,
  validateRecipe,
  viewRecipe,
} from './utils';

describe('Recipe tests', () => {
  it(`Given I have a new recipe
      When I add the new recipe name
      And ingredients
      And measurements
      And cooking method
      Then the new recipe is saved for later`, () => {
    const recipe = generateFakeRecipeObject();
    createRecipe(recipe);

    viewRecipe(recipe);
    validateRecipe(recipe);
    deleteRecipe(recipe);
  });

  it(`Given I want to look for a recipe
      When I search by the name of the recipe
      Then I find the recipe
      And I can see the ingredients
      And I can see the cooking methods`, () => {
    const recipes = [
      generateFakeRecipeObject({
        extraIngredients: [{ name: 'carrot', measure: '1', unit: 'oz' }],
        extraSteps: ['cut the carrot'],
      }),
      generateFakeRecipeObject({
        extraIngredients: [{ name: 'chicken', measure: '200', unit: 'g' }],
        extraSteps: ['chop and fry the chicken'],
      }),
      generateFakeRecipeObject(),
    ];

    recipes.forEach((recipe) => {
      createRecipe(recipe);

      cy.get("[data-testid='searchByRecipeName'").type(recipe.name);
      cy.get("[data-testid='searchRecipe']").click();

      viewRecipe(recipe);
      validateRecipe(recipe);
      deleteRecipe(recipe);
    });
  });

  it(`Given I want to look for a recipe by ingredients
      When I search by the ingredient of the recipe
      Then I find the recipe
      And I can see the ingredients
      And I can see the cooking methods`, () => {
    const recipe = generateFakeRecipeObject({
      extraIngredients: [{ name: 'chicken', measure: '200', unit: 'g' }],
      extraSteps: ['chop and fry the chicken'],
    });
    createRecipe(recipe);

    cy.get("[data-testid='filterByIngredients'")
      .parent()
      .click()
      .get(`ul > li[data-value="${recipe.ingredients[2].name}"]`)
      .click();

    cy.get('body').type('{esc}');
    cy.get("[data-testid='searchRecipe']").click();

    viewRecipe(recipe);
    validateRecipe(recipe);
    deleteRecipe(recipe);
  });
});
