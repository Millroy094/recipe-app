import {
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useState } from 'react';

interface RecipeListActionsProps {
  ingredientOptions: string[];
  navigateToRecipePage: (id: string) => void;
  onSearch: (search: string, ingredients: string[]) => void;
}

const RecipeListActions = (props: RecipeListActionsProps) => {
  const { ingredientOptions, navigateToRecipePage, onSearch } = props;
  const [searchString, setSearchString] = useState('');
  const [ingredientsToFilterBy, setIngredientsToFilterBy] = useState<string[]>(
    [],
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const onFilterChange = (e: SelectChangeEvent<unknown>) => {
    setIngredientsToFilterBy(e.target.value as string[]);
  };

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TextField
            data-testid='searchByRecipeName'
            label='Search by recipe name'
            variant='outlined'
            fullWidth
            onChange={onSearchChange}
            value={searchString}
          />
        </Grid>
        {ingredientOptions.length > 0 && (
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id='filter-by-ingredients-label'>
                Filter by Ingredients
              </InputLabel>
              <Select
                data-testid='filterByIngredients'
                labelId='filter-by-ingredients-label'
                label='Filter by Ingredients'
                variant='outlined'
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
      <Grid container justifyContent='flex-end' spacing={1}>
        <Grid item>
          <Button
            data-testid='createRecipe'
            variant='contained'
            size='large'
            color='success'
            onClick={() => navigateToRecipePage('NEW')}
          >
            Add Recipe
          </Button>
        </Grid>
        <Grid item>
          <Button
            data-testid='searchRecipe'
            variant='contained'
            size='large'
            onClick={() => onSearch(searchString, ingredientsToFilterBy)}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default RecipeListActions;
