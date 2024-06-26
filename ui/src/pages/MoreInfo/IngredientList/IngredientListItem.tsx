import { FC } from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { UNITS } from '../../../constants/units';
import { Ingredient } from '../type';
import { getFieldError, isFieldValid } from '../field-errors-utils';

interface IngredientItemProps {
  index: number;
  ingredient: Ingredient;
  formErrors: string[];
  handleIngredientOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIngredientUnitOnChange: (e: SelectChangeEvent<string>) => void;
  handleRemoveIngredient: (index: number) => void;
}

const IngredientItem: FC<IngredientItemProps> = (props) => {
  const {
    ingredient,
    formErrors,
    index,
    handleIngredientOnChange,
    handleIngredientUnitOnChange,
    handleRemoveIngredient,
  } = props;
  return (
    <Grid container item key={ingredient.id} spacing={2}>
      <Grid item xs={6}>
        <TextField
          data-testid={`ingredient_${index}_name`}
          name={`${index}_name`}
          label='Name'
          value={ingredient.name}
          fullWidth
          onChange={handleIngredientOnChange}
          error={!isFieldValid(`ingredients[${index}].name`, formErrors)}
          helperText={getFieldError(
            `ingredients[${index}].name`,
            formErrors,
            'name',
          )}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          data-testid={`ingredient_${index}_measure`}
          name={`${index}_measure`}
          label='Measure'
          value={ingredient.measure}
          fullWidth
          onChange={handleIngredientOnChange}
          error={!isFieldValid(`ingredients[${index}].measure`, formErrors)}
          helperText={getFieldError(
            `ingredients[${index}].measure`,
            formErrors,
            'measure',
          )}
        />
      </Grid>
      <Grid item xs={1}>
        <FormControl fullWidth>
          <InputLabel id='unit-select-label'>Units</InputLabel>
          <Select
            data-testid={`ingredient_${index}_unit`}
            name={`${index}_unit`}
            labelId='unit-select-label'
            label='Units'
            variant='outlined'
            fullWidth
            value={ingredient.unit}
            onChange={handleIngredientUnitOnChange}
            error={!isFieldValid(`ingredients[${index}].unit`, formErrors)}
          >
            {UNITS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {!isFieldValid(`ingredients[${index}].unit`, formErrors) && (
            <FormHelperText>
              <Typography variant='inherit' color='error'>
                {getFieldError(
                  `ingredients[${index}].unit`,
                  formErrors,
                  'unit',
                )}
              </Typography>
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid container item xs={1} justifyContent='center'>
        <IconButton onClick={() => handleRemoveIngredient(index)}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default IngredientItem;
