import { FC } from "react";
import { Grid, SelectChangeEvent, Typography } from "@mui/material";
import AddItemAccordion from "../AddItemAccordion";
import { FormErrors, Ingredient } from "../type";
import IngredientListItem from "./IngredientListItem";

interface IngredientListProps {
  ingredients: Ingredient[];
  formErrors: FormErrors;
  handleIngredientOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIngredientUnitOnChange: (e: SelectChangeEvent<string>) => void;
  handleAddIngredient: () => void;
  handleRemoveIngredient: (index: number) => void;
}

const IngredientList: FC<IngredientListProps> = (
  props: IngredientListProps
) => {
  const {
    ingredients,
    formErrors,
    handleAddIngredient,
    handleIngredientOnChange,
    handleIngredientUnitOnChange,
    handleRemoveIngredient,
  } = props;
  return (
    <AddItemAccordion
      error={formErrors.ingredients["ingredients"]}
      title="Ingredients"
      addItemButtonLabel="Add Ingredient"
      addItemButtonTestId="addIngredient"
      handleAddItem={handleAddIngredient}
    >
      {ingredients?.length > 0 ? (
        <Grid container direction="column" spacing={2}>
          {ingredients.map((ingredient: Ingredient, index: number) => (
            <IngredientListItem
              key={ingredient.id}
              ingredient={ingredient}
              index={index}
              formErrors={formErrors}
              handleRemoveIngredient={handleRemoveIngredient}
              handleIngredientOnChange={handleIngredientOnChange}
              handleIngredientUnitOnChange={handleIngredientUnitOnChange}
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
