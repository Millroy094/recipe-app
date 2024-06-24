import * as React from 'react';
import { render, screen } from '@testing-library/react';

import RecipeList from './index';

describe('RecipeList', () => {
  it('renders RecipeList component with no recipes', () => {
    render(
      <RecipeList
        recipes={[]}
        onRemove={() => {}}
        navigateToRecipePage={(id: string) => {}}
      />,
    );

    screen.getByText(
      'No Recipes stored. Please click on the Add Recipe button to create one',
    );
  });

  it('renders RecipeList component with some recipes', () => {
    render(
      <RecipeList
        recipes={[{ id: 'test1', name: 'test1', ingredientNames: ['onion'] }]}
        onRemove={() => {}}
        navigateToRecipePage={(id: string) => {}}
      />,
    );

    screen.getByText(`Recipe Name: test1`);
  });
});
