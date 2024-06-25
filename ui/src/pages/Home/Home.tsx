import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useLazyQuery, useMutation } from "@apollo/client";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getRecipesQuery from "../../gql/queries/get-recipes";
import removeRecipeQuery from "../../gql/mutations/remove-recipe";
import RecipeListActions from "./RecipeListActions";
import RecipeList from "./RecipeList";

interface RecipeListing {
  id: string;
  name: string;
  ingredientNames: string[];
}

const Home: FC<{}> = () => {
  const [recipes, setRecipes] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);

  const [getRecipes, { loading, data }] = useLazyQuery(getRecipesQuery);
  const [removeRecipe] = useMutation(removeRecipeQuery);

  const navigate = useNavigate();

  const navigateToRecipePage = (id: string) => {
    navigate(`/recipe/${id}`);
  };

  const onSearch = async (search: string, ingredients: string[]) => {
    await getRecipes({
      variables: { search, ingredients },
    });
  };

  const onRemove = async (recipeId: string) => {
    await removeRecipe({ variables: { recipeId } });
    setRecipes(
      recipes.filter((recipe: RecipeListing) => recipe.id !== recipeId)
    );
  };

  useEffect(() => {
    getRecipes();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!loading && data) {
      const { getRecipes = [] } = data;

      setIngredientOptions(
        getRecipes.reduce(
          (ingredients: string[], recipe: RecipeListing) => [
            ...new Set(ingredients.concat(recipe.ingredientNames)),
          ],
          []
        )
      );

      setRecipes(getRecipes);
    }
    // eslint-disable-next-line
  }, [data, loading]);

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
    <Container maxWidth="lg">
      <Grid container direction="column" spacing={2}>
        <Grid container item justifyContent="center">
          <Typography variant="h4">My Favorite Recipes</Typography>
        </Grid>
        <Grid item>
          <RecipeListActions
            ingredientOptions={ingredientOptions}
            navigateToRecipePage={navigateToRecipePage}
            onSearch={onSearch}
          />
        </Grid>
        <Grid item>
          <RecipeList
            recipes={recipes}
            onRemove={onRemove}
            navigateToRecipePage={navigateToRecipePage}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
