import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import getRecipesQuery from "../../gql/queries/get-recipes";
import removeRecipeQuery from "../../gql/mutations/remove-recipe";

interface Recipe {
  id: string;
  name: string;
  ingredientNames: string[];
}

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [ingredientsToFilterBy, setIngredientsToFilterBy] = useState<string[]>(
    []
  );

  const [getRecipes, { loading, data }] = useLazyQuery(getRecipesQuery);
  const [removeRecipe] = useMutation(removeRecipeQuery);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const onFilterChange = (e: SelectChangeEvent<unknown>) => {
    setIngredientsToFilterBy(e.target.value as string[]);
  };

  const onSearch = () => {
    getRecipes({
      variables: { search: searchString, ingredients: ingredientsToFilterBy },
    });
  };

  const onRemove = (recipeId: string) => {
    removeRecipe({ variables: { recipeId } });
    setRecipes(recipes.filter((recipe: Recipe) => recipe.id !== recipeId));
  };

  useEffect(() => {
    getRecipes();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      const { getRecipes = [] } = data;

      setIngredientOptions(
        getRecipes.reduce(
          (ingredients: string[], recipe: Recipe) => [
            ...new Set(ingredients.concat(recipe.ingredientNames)),
          ],
          []
        )
      );

      setRecipes(getRecipes);
    }
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
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h4">My Favorite Recipes</Typography>
      </Grid>
      <Grid item>
        <Card sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                label="Search by recipe name"
                variant="outlined"
                fullWidth
                onChange={onSearchChange}
                value={searchString}
              />
            </Grid>
            {ingredientOptions.length > 0 && (
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="filter-by-ingredients-label">
                    Filter by Ingredients
                  </InputLabel>
                  <Select
                    labelId="filter-by-ingredients-label"
                    variant="outlined"
                    fullWidth
                    multiple
                    value={ingredientsToFilterBy}
                    onChange={onFilterChange}
                  >
                    {ingredientOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
          <Grid container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button variant="contained" size="large" color="success">
                Add Recipe
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" size="large" onClick={onSearch}>
                Search
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item>
        <Card sx={{ p: 2 }}>
          {recipes?.length > 0 ? (
            <Grid container direction="column" spacing={2}>
              {recipes.map((recipe: Recipe) => (
                <Grid item key={recipe.id}>
                  <Card sx={{ p: 2 }}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Typography variant="h6">{`Recipe Name: ${recipe.name}`}</Typography>
                      </Grid>
                      <Grid item container spacing={1} alignItems="center">
                        <Grid item>
                          <Typography variant="body1">Ingredients:</Typography>
                        </Grid>
                        {recipe?.ingredientNames?.map((ingredientName) => (
                          <Grid key={ingredientName} item>
                            <Chip
                              label={ingredientName}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                        ))}
                      </Grid>

                      <Grid
                        container
                        item
                        justifyContent="flex-end"
                        spacing={1}
                      >
                        <Grid item>
                          <Button variant="contained" color="primary">
                            View Recipe
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => onRemove(recipe.id)}
                          >
                            Delete Recipe
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>
              No Recipes stored. Please click on the Add Recipe button to create
              one
            </Typography>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};
