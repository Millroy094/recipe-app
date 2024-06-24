import * as React from 'react';
import { render, screen } from '@testing-library/react';

import IngredientList from './index';
import { SelectChangeEvent } from '@mui/material';

describe('IngredientList', () => {
  it('renders IngredientList component with no ingredients', () => {
    render(
      <IngredientList
        ingredients={[]}
        formErrors={{ name: '', ingredients: {}, steps: {} }}
        handleRemoveIngredient={(index: number) => {}}
        handleIngredientOnChange={(
          e: React.ChangeEvent<HTMLInputElement>,
        ) => {}}
        handleIngredientUnitOnChange={(e: SelectChangeEvent<string>) => {}}
        handleAddIngredient={() => {}}
      />,
    );

    screen.getByText('Please press the add button to add ingredients');
  });

  it('renders IngredientList component with some ingredients', () => {
    render(
      <IngredientList
        ingredients={[
          { id: '1', name: 'onion', measure: '1', unit: 'qty' },
          { id: '2', name: 'tomato', measure: '1', unit: 'qty' },
        ]}
        formErrors={{ name: '', ingredients: {}, steps: {} }}
        handleRemoveIngredient={(index: number) => {}}
        handleIngredientOnChange={(
          e: React.ChangeEvent<HTMLInputElement>,
        ) => {}}
        handleIngredientUnitOnChange={(e: SelectChangeEvent<string>) => {}}
        handleAddIngredient={() => {}}
      />,
    );

    screen.getByDisplayValue('onion');
    screen.getByDisplayValue('tomato');
  });
});
