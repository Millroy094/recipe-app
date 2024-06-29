import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import Home from './index';
import getRecipesQuery from '../../gql/queries/get-recipes';
import removeRecipe from '../../gql/mutations/remove-recipe';

describe('Home', () => {
  it('Renders App component with no recipes', async () => {
    const mocks = [
      {
        request: {
          query: getRecipesQuery,
        },
        result: {
          data: {
            getRecipes: [],
          },
        },
      },
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Home />
        </MockedProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        'No Recipes stored. Please click on the Add Recipe button to create one',
      ),
    ).toBeInTheDocument();
  });

  it('Renders Home component with some recipes', async () => {
    const mocks = [
      {
        request: {
          query: getRecipesQuery,
        },
        result: {
          data: {
            getRecipes: [
              {
                id: '1',
                name: 'test1',
                ingredientNames: ['onion', 'tomato'],
              },
            ],
          },
        },
      },
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Home />
        </MockedProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Recipe Name: test1')).toBeInTheDocument();
    expect(await screen.findByText('onion')).toBeInTheDocument();
    expect(await screen.findByText('tomato')).toBeInTheDocument();
  });

  it('Navigates to new recipe more info page when create button is pressed', async () => {
    const mocks = [
      {
        request: {
          query: getRecipesQuery,
        },
        result: {
          data: {
            getRecipes: [],
          },
        },
      },
    ];

    const navigate = jest.fn();

    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Home />
        </MockedProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        'No Recipes stored. Please click on the Add Recipe button to create one',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('createRecipe'));

    expect(navigate).toHaveBeenCalledWith('/recipe/NEW');
  });

  it('Deletes recipe when clicked delete recipe button', async () => {
    const mocks = [
      {
        request: {
          query: getRecipesQuery,
        },
        result: {
          data: {
            getRecipes: [
              {
                id: '1',
                name: 'test1',
                ingredientNames: ['onion', 'tomato'],
              },

              {
                id: '2',
                name: 'test2',
                ingredientNames: ['onion'],
              },
            ],
          },
        },
      },
      {
        request: {
          query: removeRecipe,
          variables: { recipeId: '1' },
        },

        result: {
          data: {
            removeRecipe: true,
          },
        },
      },
    ];
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Home />
        </MockedProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Recipe Name: test1')).toBeInTheDocument();

    expect(await screen.findByText('Recipe Name: test2')).toBeInTheDocument();

    const firstRecipeRemoveButton = screen.getAllByTestId('removeRecipe')[0];

    fireEvent.click(firstRecipeRemoveButton);

    await waitFor(() => {
      expect(screen.queryByText('Recipe Name: test1')).not.toBeInTheDocument();
    });
  });

  it('Navigates to recipe more info page when clicked on view recipe', async () => {
    const mocks = [
      {
        request: {
          query: getRecipesQuery,
        },
        result: {
          data: {
            getRecipes: [
              {
                id: '1',
                name: 'test1',
                ingredientNames: ['onion', 'tomato'],
              },
            ],
          },
        },
      },
      {
        request: {
          query: removeRecipe,
          variables: { recipeId: '1' },
        },
      },
    ];

    const navigate = jest.fn();

    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Home />
        </MockedProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Recipe Name: test1')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('viewRecipe'));

    expect(navigate).toHaveBeenCalledWith('/recipe/1');
  });
});
