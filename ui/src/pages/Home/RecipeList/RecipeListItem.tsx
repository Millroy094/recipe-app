import { Button, Card, Chip, Grid, Typography } from "@mui/material";
import { RecipeListing } from "./type";

interface RecipeListItemProps {
  recipe: RecipeListing;
  navigateToRecipePage: (id: string) => void;
  onRemove: (id: string) => void;
}

const RecipeListItem = (props: RecipeListItemProps) => {
  const { recipe, navigateToRecipePage, onRemove } = props;
  return (
    <Card sx={{ p: 2 }} data-testid="recipe">
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
              <Chip label={ingredientName} variant="outlined" size="small" />
            </Grid>
          ))}
        </Grid>

        <Grid container item justifyContent="flex-end" spacing={1}>
          <Grid item>
            <Button
              data-testid="viewRecipe"
              variant="contained"
              color="primary"
              onClick={() => navigateToRecipePage(recipe.id)}
            >
              View Recipe
            </Button>
          </Grid>
          <Grid item>
            <Button
              aria-label={`removeRecipe_${recipe.id}`}
              data-testid="removeRecipe"
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
  );
};

export default RecipeListItem;
