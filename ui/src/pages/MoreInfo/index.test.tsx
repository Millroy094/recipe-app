import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router';

import { MockedProvider } from '@apollo/client/testing';
import MoreInfo from './index';

import { fireEvent, render, screen } from '@testing-library/react';

describe('MoreInfo', () => {
  it('Renders MoreInfo component with empty fields for new recipe', async () => {
    jest.spyOn(router, 'useParams').mockReturnValueOnce({
      id: 'NEW',
    });

    render(
      <MemoryRouter initialEntries={['/recipe/NEW']}>
        <MockedProvider mocks={[]} addTypename={false}>
          <MoreInfo />
        </MockedProvider>
      </MemoryRouter>,
    );

    const recipeNameField = await screen.findByLabelText('Recipe Name');
    expect((recipeNameField as HTMLInputElement).value).toBe('');

    screen.getByRole('button', {
      name: /create/i,
    });

    expect(
      await screen.findByText('Please press the add button to add ingredients'),
    ).toBeInTheDocument();

    expect(
      await screen.findByText('Please press the add button to add a step'),
    ).toBeInTheDocument();
  });

  it('See form errors when fields are empty', async () => {
    jest.spyOn(router, 'useParams').mockReturnValueOnce({
      id: 'NEW',
    });

    render(
      <MemoryRouter initialEntries={['/recipe/NEW']}>
        <MockedProvider mocks={[]} addTypename={false}>
          <MoreInfo />
        </MockedProvider>
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /create/i,
      }),
    );

    expect(
      await screen.findByText('Need to add at least one ingredient'),
    ).toBeInTheDocument();

    expect(
      await screen.findByText('Need to add at least one step'),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: /add ingredient/i,
      }),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /add step/i,
      }),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /create/i,
      }),
    );

    expect(
      await screen.findByText('Ingredient name is required'),
    ).toBeInTheDocument();

    expect(
      await screen.findByText('Ingredient measure is required'),
    ).toBeInTheDocument();

    expect(
      await screen.findByText('Ingredient unit is required'),
    ).toBeInTheDocument();

    expect(
      await screen.findByText('Step description is required'),
    ).toBeInTheDocument();
  });

  it('Able add or remove ingredients and steps', async () => {
    jest.spyOn(router, 'useParams').mockReturnValueOnce({
      id: 'NEW',
    });

    render(
      <MemoryRouter initialEntries={['/recipe/NEW']}>
        <MockedProvider mocks={[]} addTypename={false}>
          <MoreInfo />
        </MockedProvider>
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /add ingredient/i,
      }),
    );

    expect(() => screen.getByTestId('removeIngredient')).not.toThrow(
      'Unable to find an element by: [data-testid="removeIngredient"]',
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /add step/i,
      }),
    );

    expect(() => screen.getByTestId('removeStep')).not.toThrow(
      'Unable to find an element by: [data-testid="removeStep"]',
    );

    fireEvent.click(screen.getByTestId('removeIngredient'));

    expect(() => screen.getByTestId('removeIngredient')).toThrow(
      'Unable to find an element by: [data-testid="removeIngredient"]',
    );

    fireEvent.click(screen.getByTestId('removeStep'));

    expect(() => screen.getByTestId('removeStep')).toThrow(
      'Unable to find an element by: [data-testid="removeStep"]',
    );
  });
});
