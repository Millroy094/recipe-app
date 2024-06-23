import { v4 as uuid } from 'uuid';

interface Ingredient {
  name: string;
  measure: string;
  unit: string;
}

interface Recipe {
  name: string;
  ingredients: Ingredient[];
  steps: string[];
}

interface ExtraRecipeData {
  extraIngredients?: Ingredient[];
  extraSteps?: string[];
}

export const generateFakeRecipeObject = (
  extraRecipeData?: ExtraRecipeData,
): Recipe => {
  const extraIngredients = extraRecipeData?.extraIngredients ?? [];
  const extraSteps = extraRecipeData?.extraSteps ?? [];

  const recipe: Recipe = {
    name: `Test ${uuid()}`,
    ingredients: [
      { name: 'onion', measure: '1/2', unit: 'cup' },
      { name: 'tomato', measure: '1', unit: 'cup' },
      ...extraIngredients,
    ],
    steps: ['Cut the onion and tomato', 'Fry the two', ...extraSteps],
  };

  return recipe;
};

export const createRecipe = (recipe: Recipe) => {
  cy.visit('/');
  cy.get("[data-testid='createRecipe']").click();
  cy.url().should('eq', `${Cypress.config('baseUrl')}/recipe/NEW`);

  cy.get('[data-testid="recipeName"]').type(recipe.name);

  recipe.ingredients.forEach((ingredient: Ingredient, index) => {
    cy.get('[data-testid="addIngredient"]').click();
    cy.get(`[data-testid="ingredient_${index}_name"]`).type(ingredient.name);
    cy.get(`[data-testid="ingredient_${index}_measure"]`).type(
      ingredient.measure,
    );
    cy.get(`[data-testid="ingredient_${index}_unit"]`)
      .parent()
      .click()
      .get(`ul > li[data-value="${ingredient.unit}"]`)
      .click();
  });

  recipe.steps.forEach((step, index) => {
    cy.get('[data-testid="addStep"]').click();
    cy.get(`[data-testid="step_${index}"]`).type(step);
  });

  cy.get('[data-testid="submitRecipe"]').click();

  cy.location().should((loc) => {
    expect(loc.pathname.toString()).to.not.contain('/recipe/NEW');
  });

  cy.get('[data-testid="goBack"]').click();

  cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
};

export const validateRecipe = (recipe: Recipe) => {
  cy.get('[data-testid="recipeName"]')
    .find('input')
    .invoke('val')
    .should('equal', recipe.name);

  recipe.ingredients.forEach((ingredient, index) => {
    cy.get(`[data-testid="ingredient_${index}_name"]`)
      .find('input')
      .invoke('val')
      .should('equal', ingredient.name);
    cy.get(`[data-testid="ingredient_${index}_measure"]`)
      .find('input')
      .invoke('val')
      .should('equal', ingredient.measure);
    cy.get(`[data-testid="ingredient_${index}_unit"]`)
      .find('input')
      .invoke('val')
      .should('equal', ingredient.unit);
  });

  recipe.steps.forEach((step, index) => {
    cy.get(`[data-testid="step_${index}"]`)
      .find('input')
      .invoke('val')
      .should('equal', step);
  });

  cy.get('[data-testid="goBack"]').click();
};

export const viewRecipe = (recipe: Recipe) => {
  cy.contains(`Recipe Name: ${recipe.name}`)
    .closest("[data-testid='recipe']")
    .find("[data-testid='viewRecipe']")
    .click();
};

export const deleteRecipe = (recipe: Recipe) => {
  cy.contains(`Recipe Name: ${recipe.name}`)
    .closest("[data-testid='recipe']")
    .find("[data-testid='removeRecipe']")
    .click();
};
