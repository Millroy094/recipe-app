import { Card, Grid, Typography } from "@mui/material";
import { RecipeListing } from "./type";
import RecipeListItem from "./RecipeListItem";
import { FC } from "react";

interface RecipeListProps {
  recipes: RecipeListing[];
  navigateToRecipePage: (id: string) => void;
  onRemove: (id: string) => void;
}
const RecipeList: FC<RecipeListProps> = (props) => {
  const { recipes, navigateToRecipePage, onRemove } = props;
  return (
    <Card sx={{ p: 2 }}>
      {recipes?.length > 0 ? (
        <Grid container direction="column" spacing={2}>
          {recipes.map((recipe: RecipeListing) => (
            <Grid item key={recipe.id}>
              <RecipeListItem
                recipe={recipe}
                navigateToRecipePage={navigateToRecipePage}
                onRemove={onRemove}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>
          No Recipes stored. Please click on the Add Recipe button to create one
        </Typography>
      )}
    </Card>
  );
};

export default RecipeList;
