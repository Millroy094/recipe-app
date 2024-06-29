import { FC } from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { UNITS } from '../../../constants/units';
import {
  FieldErrors,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
} from 'react-hook-form';
import { has } from 'lodash';

interface IngredientItemProps {
  id: string;
  index: number;
  errors: FieldErrors;
  getValues: UseFormGetValues<any>;
  register: UseFormRegister<any>;
  remove: UseFieldArrayRemove;
}

const IngredientItem: FC<IngredientItemProps> = (props) => {
  const { id, index, errors, getValues, register, remove } = props;
  return (
    <Grid container item key={id} spacing={2}>
      <Grid item xs={6}>
        <TextField
          data-testid={`ingredient_${index}_name`}
          label='Name'
          fullWidth
          {...register(`ingredients[${index}].name`)}
          error={has(errors, `ingredients[${index}].name`)}
          helperText={
            has(errors, `ingredients[${index}].name`)
              ? 'Ingredient name is required'
              : ''
          }
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          data-testid={`ingredient_${index}_measure`}
          label='Measure'
          fullWidth
          {...register(`ingredients[${index}].measure`)}
          error={has(errors, `ingredients[${index}].measure`)}
          helperText={
            has(errors, `ingredients[${index}].measure`)
              ? 'Ingredient measure is required'
              : ''
          }
        />
      </Grid>
      <Grid item xs={1}>
        <FormControl fullWidth>
          <InputLabel id='unit-select-label'>Units</InputLabel>
          <Select
            data-testid={`ingredient_${index}_unit`}
            labelId='unit-select-label'
            label='Units'
            variant='outlined'
            fullWidth
            {...register(`ingredients[${index}].unit`)}
            defaultValue={getValues(`ingredients[${index}].unit`)}
            error={has(errors, `ingredients[${index}].unit`)}
          >
            {UNITS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {has(errors, `ingredients[${index}].unit`) && (
            <FormHelperText>
              {has(errors, `ingredients[${index}].measure`)
                ? 'Ingredient unit is required'
                : ''}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid container item xs={1} justifyContent='center'>
        <IconButton
          data-testid='removeIngredient'
          onClick={() => remove(index)}
        >
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default IngredientItem;
