import { Container, Grid, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import RecipeListActions from "./RecipeListActions";
import RecipeList from "./RecipeList";

interface RecipeListing {
  id: string;
  name: string;
  ingredientNames: string[];
}

const Home: FC<{
  data: any;
  navigateToRecipePage: (recipeId: string) => void;
  onSearch: (search: string, ingredients: string[]) => Promise<void>;
  onRemove: (recipeId: string) => Promise<void>;
}> = (props) => {
  const { data, navigateToRecipePage, onSearch, onRemove } = props;

  const [recipes, setRecipes] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);

  const handleRemove = async (recipeId: string) => {
    await onRemove(recipeId);
    setRecipes(
      recipes.filter((recipe: RecipeListing) => recipe.id !== recipeId)
    );
  };

  useEffect(() => {
    if (data) {
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
  }, [data]);

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
            onRemove={handleRemove}
            navigateToRecipePage={navigateToRecipePage}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
