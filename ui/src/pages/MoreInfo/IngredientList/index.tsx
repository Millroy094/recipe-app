import { FC } from "react";
import { v4 as uuidv4 } from "uuid";

import { Grid, Typography } from "@mui/material";
import AddItemAccordion from "../AddItemAccordion";
import IngredientListItem from "./IngredientListItem";
import { isArray, isEmpty } from "lodash";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";

interface IngredientListProps {
  getValues: UseFormGetValues<any>;
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: FieldErrors;
}

const IngredientList: FC<IngredientListProps> = (
  props: IngredientListProps
) => {
  const { getValues, register, control, errors } = props;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });
  return (
    <AddItemAccordion
      error={
        !isEmpty(errors.ingredients) && !isArray(errors.ingredients)
          ? "Need to add at least one ingredient"
          : ""
      }
      title="Ingredients"
      addItemButtonLabel="Add Ingredient"
      addItemButtonTestId="addIngredient"
      handleAddItem={() =>
        append({ id: uuidv4(), name: "", measure: "", unit: "" })
      }
    >
      {fields?.length > 0 ? (
        <Grid container direction="column" spacing={2}>
          {fields.map((field: any, index: number) => (
            <IngredientListItem
              id={field.id}
              key={field.id}
              index={index}
              errors={errors}
              getValues={getValues}
              register={register}
              remove={remove}
            />
          ))}
        </Grid>
      ) : (
        <Typography variant="inherit">
          Please press the add button to add ingredients
        </Typography>
      )}
    </AddItemAccordion>
  );
};

export default IngredientList;
