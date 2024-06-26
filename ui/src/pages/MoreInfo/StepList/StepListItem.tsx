import { FC } from 'react';
import { Grid, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Step } from '../type';
import { getFieldError, isFieldValid } from '../field-errors-utils';

interface StepProps {
  step: Step;
  stepCount: number;
  index: number;
  formErrors: string[];
  handleStepOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMoveStepUp: (index: number) => void;
  handleMoveStepDown: (index: number) => void;
  handleRemoveStep: (index: number) => void;
}

const StepListItem: FC<StepProps> = (props) => {
  const {
    step,
    stepCount,
    index,
    formErrors,
    handleStepOnChange,
    handleMoveStepUp,
    handleMoveStepDown,
    handleRemoveStep,
  } = props;
  return (
    <Grid key={step.id} container item>
      <Grid item xs={10}>
        <TextField
          data-testid={`step_${index}`}
          name={`${index}_step`}
          label={`Step ${index + 1}`}
          value={step.step}
          fullWidth
          onChange={handleStepOnChange}
          error={!isFieldValid(`steps[${index}].step`, formErrors)}
          helperText={getFieldError(`steps[${index}].step`, formErrors, 'step')}
        />
      </Grid>
      <Grid container item xs={2} justifyContent='center'>
        <IconButton
          onClick={() => handleMoveStepUp(index)}
          disabled={index === 0}
        >
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton
          onClick={() => handleMoveStepDown(index)}
          disabled={index + 1 >= stepCount}
        >
          <ArrowDownwardIcon />
        </IconButton>
        <IconButton onClick={() => handleRemoveStep(index)}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default StepListItem;
