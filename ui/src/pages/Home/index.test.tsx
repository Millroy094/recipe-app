import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import Home from "./index";
import getRecipesQuery from "../../gql/queries/get-recipes";
import removeRecipe from "../../gql/mutations/remove-recipe";

describe.only("Home", () => {
  it("renders App component with no recipes", async () => {
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
      </MemoryRouter>
    );

    expect(
      await screen.findByText(
        "No Recipes stored. Please click on the Add Recipe button to create one"
      )
    ).toBeInTheDocument();
  });

  it("renders Home component with some recipes", async () => {
    const mocks = [
      {
        request: {
          query: getRecipesQuery,
        },
        result: {
          data: {
            getRecipes: [
              {
                id: "1",
                name: "test1",
                ingredientNames: ["onion", "tomato"],
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
      </MemoryRouter>
    );

    expect(await screen.findByText("Recipe Name: test1")).toBeInTheDocument();
    expect(await screen.findByText("onion")).toBeInTheDocument();
    expect(await screen.findByText("tomato")).toBeInTheDocument();
  });

  it("renders Home component with some recipes and deletes one recipe", async () => {
    const mocks = [
      {
        request: {
          query: getRecipesQuery,
        },
        result: {
          data: {
            getRecipes: [
              {
                id: "1",
                name: "test1",
                ingredientNames: ["onion", "tomato"],
              },

              {
                id: "2",
                name: "test2",
                ingredientNames: ["onion"],
              },
            ],
          },
        },
      },
      {
        request: {
          query: removeRecipe,
          variables: { recipeId: "1" },
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
      </MemoryRouter>
    );

    expect(await screen.findByText("Recipe Name: test1")).toBeInTheDocument();

    expect(await screen.findByText("Recipe Name: test2")).toBeInTheDocument();

    const firstRecipeRemoveButton = screen.getAllByTestId("removeRecipe")[0];

    fireEvent.click(firstRecipeRemoveButton);

    await waitFor(() => {
      expect(screen.queryByText("Recipe Name: test1")).not.toBeInTheDocument();
    });
  });
});
