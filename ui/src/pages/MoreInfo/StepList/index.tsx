import { FC } from "react";
import { v4 as uuidv4 } from "uuid";

import { Grid, Typography } from "@mui/material";
import AddItemAccordion from "../AddItemAccordion";
import StepListItem from "./StepListItem";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form";
import { isArray, isEmpty } from "lodash";

interface StepListProps {
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: FieldErrors;
}

const StepList: FC<StepListProps> = (props) => {
  const { register, control, errors } = props;

  const { fields, swap, remove, append } = useFieldArray({
    control,
    name: "steps",
  });

  return (
    <AddItemAccordion
      error={
        !isEmpty(errors.steps) && !isArray(errors.steps)
          ? "Need to add at least one step"
          : ""
      }
      title="Steps"
      addItemButtonLabel="Add Step"
      addItemButtonTestId="addStep"
      handleAddItem={() => append({ id: uuidv4(), step: "" })}
    >
      {fields?.length > 0 ? (
        <Grid container direction="column" spacing={2}>
          {fields.map((field: any, index: number) => (
            <StepListItem
              id={field.id}
              register={register}
              key={field.id}
              index={index}
              stepCount={fields.length}
              errors={errors}
              swap={swap}
              remove={remove}
            />
          ))}
        </Grid>
      ) : (
        <Typography variant="inherit">
          Please press the add button to add a step
        </Typography>
      )}
    </AddItemAccordion>
  );
};

export default StepList;
