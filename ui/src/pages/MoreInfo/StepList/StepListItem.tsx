import { FC } from "react";
import { Grid, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  FieldErrors,
  UseFieldArrayRemove,
  UseFieldArraySwap,
  UseFormRegister,
} from "react-hook-form";
import { has } from "lodash";
import { Recipe } from "../type";

interface StepProps {
  id: string;
  index: number;
  errors: FieldErrors<Recipe>;
  stepCount: number;
  register: UseFormRegister<Recipe>;
  swap: UseFieldArraySwap;
  remove: UseFieldArrayRemove;
}

const StepListItem: FC<StepProps> = (props) => {
  const { register, stepCount, id, index, errors, remove, swap } = props;
  return (
    <Grid key={id} container item>
      <Grid item xs={10}>
        <TextField
          data-testid={`step_${index}`}
          label={`Step ${index + 1}`}
          fullWidth
          {...register(`steps.${index}.step`)}
          error={has(errors, `steps[${index}].step`)}
          helperText={
            has(errors, `steps[${index}].step`)
              ? "Step description is required"
              : ""
          }
        />
      </Grid>
      <Grid container item xs={2} justifyContent="center">
        <IconButton
          onClick={() => swap(index, index - 1)}
          disabled={index === 0}
        >
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton
          onClick={() => swap(index, index + 1)}
          disabled={index + 1 >= stepCount}
        >
          <ArrowDownwardIcon />
        </IconButton>
        <IconButton data-testid="removeStep" onClick={() => remove(index)}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default StepListItem;
