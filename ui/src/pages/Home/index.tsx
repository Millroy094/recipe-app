import { FC, useEffect } from "react";
import Home from "./Home";
import { Box, CircularProgress } from "@mui/material";

import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import getRecipesQuery from "../../gql/queries/get-recipes";
import removeRecipeQuery from "../../gql/mutations/remove-recipe";

const HomeContainer: FC<{}> = () => {
  const [getRecipes, { loading, data }] = useLazyQuery(getRecipesQuery);
  const [removeRecipe] = useMutation(removeRecipeQuery);

  useEffect(() => {
    getRecipes();
    // eslint-disable-next-line
  }, []);

  const navigate = useNavigate();

  const navigateToRecipePage = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  const onRemove = async (recipeId: string): Promise<void> => {
    await removeRecipe({ variables: { recipeId } });
  };

  const onSearch = async (search: string, ingredients: string[]) => {
    await getRecipes({
      variables: { search, ingredients },
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "1000px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress data-testid="home-progress-bar" color="success" />
      </Box>
    );
  }

  return (
    <Home
      data={data}
      navigateToRecipePage={navigateToRecipePage}
      onSearch={onSearch}
      onRemove={onRemove}
    />
  );
};

export default HomeContainer;
