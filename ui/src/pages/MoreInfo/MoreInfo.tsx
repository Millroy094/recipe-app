import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import { Ingredient, Recipe, RecipeFormData, Step } from "./type";
import IngredientList from "./IngredientList";
import StepList from "./StepList";
import schema from "./schema";
import { getFieldError, isFieldValid } from "./field-errors-utils";

const initialFormState = { id: "", name: "", ingredients: [], steps: [] };

const MoreInfo: FC<{
  data: any;
  onSubmit: (formData: RecipeFormData) => Promise<void>;
  navigateToHome: () => void;
  submitLabel: string;
}> = (props) => {
  const { data, onSubmit, navigateToHome, submitLabel } = props;
  const [form, setForm] = useState<Recipe>(initialFormState);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      const { getRecipe } = data;

      setForm({
        ...getRecipe,
        ingredients: [
          ...getRecipe.ingredients.map(
            (ingredient: { name: string; measure: string; unit: string }) => ({
              ...ingredient,
              id: uuidv4(),
            })
          ),
        ],

        steps: [
          ...getRecipe.steps.map((step: string) => ({
            step,
            id: uuidv4(),
          })),
        ],
      });
    }
  }, [data]);

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      name: e.target.value,
    });
  };

  const handleAddStep = () => {
    setForm({ ...form, steps: [...form.steps, { id: uuidv4(), step: "" }] });
  };

  const handleRemoveStep = (index: number) => {
    setForm({
      ...form,
      steps: form.steps.filter((step: Step, i: number) => i !== index),
    });
  };

  const handleMoveStepUp = (index: number) => {
    if (index !== 0) {
      const previousStep = form.steps[index - 1];
      const currentStep = form.steps[index];

      setForm({
        ...form,
        steps: form.steps.map((step: Step, i: number) => {
          if (index === i) {
            return previousStep;
          } else if (index - 1 === i) {
            return currentStep;
          }

          return step;
        }),
      });
    }
  };

  const handleMoveStepDown = (index: number) => {
    if (index + 1 < form.steps.length) {
      const nextStep = form.steps[index + 1];
      const currentStep = form.steps[index];

      setForm({
        ...form,
        steps: form.steps.map((step: Step, i: number) => {
          if (index === i) {
            return nextStep;
          } else if (index + 1 === i) {
            return currentStep;
          }

          return step;
        }),
      });
    }
  };

  const handleStepOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [index] = name.split("_");
    setForm({
      ...form,
      steps: form.steps.map((step: Step, i: number) =>
        i === parseInt(index) ? { ...step, step: value } : step
      ),
    });
  };

  const handleAddIngredient = () => {
    setForm({
      ...form,
      ingredients: [
        ...form.ingredients,
        { id: uuidv4(), name: "", measure: "", unit: "" },
      ],
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setForm({
      ...form,
      ingredients: form.ingredients.filter(
        (ingredient: Ingredient, i: number) => i !== index
      ),
    });
  };

  const handleIngredientOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [index, fieldName] = name.split("_");
    setForm({
      ...form,
      ingredients: form.ingredients.map((ingredient: Ingredient, i: number) =>
        i === parseInt(index)
          ? { ...ingredient, [fieldName]: value }
          : ingredient
      ),
    });
  };

  const handleIngredientUnitOnChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    const [index] = name.split("_");
    setForm({
      ...form,
      ingredients: form.ingredients.map((ingredient: Ingredient, i: number) =>
        i === parseInt(index) ? { ...ingredient, unit: value } : ingredient
      ),
    });
  };

  const handleSubmit = async () => {
    try {
      await schema.validate(form, { abortEarly: false });

      const formData: RecipeFormData = {
        id: form.id,
        name: form.name,
        ingredients: form.ingredients.map(
          ({ name, measure, unit }: Ingredient) => ({
            name,
            measure,
            unit,
          })
        ),
        steps: [...form.steps.map((step: Step) => step.step)],
      };
      await onSubmit(formData);
    } catch (err: any) {
      setFormErrors(err.errors);
    }
  };

  const { name, ingredients, steps } = form;

  return (
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              data-testid="recipeName"
              label="Recipe Name"
              fullWidth
              value={name}
              error={!isFieldValid("name", formErrors)}
              helperText={getFieldError("name", formErrors)}
              onChange={onChangeName}
            />
          </Grid>
          <Grid item>
            <IngredientList
              ingredients={ingredients}
              formErrors={formErrors}
              handleIngredientOnChange={handleIngredientOnChange}
              handleIngredientUnitOnChange={handleIngredientUnitOnChange}
              handleAddIngredient={handleAddIngredient}
              handleRemoveIngredient={handleRemoveIngredient}
            />
          </Grid>
          <Grid item>
            <StepList
              steps={steps}
              formErrors={formErrors}
              handleAddStep={handleAddStep}
              handleRemoveStep={handleRemoveStep}
              handleStepOnChange={handleStepOnChange}
              handleMoveStepUp={handleMoveStepUp}
              handleMoveStepDown={handleMoveStepDown}
            />
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item>
            <Button
              data-testid="goBack"
              variant="contained"
              color="secondary"
              onClick={() => navigateToHome()}
            >
              Go back
            </Button>
          </Grid>
          <Grid item>
            <Button
              data-testid="submitRecipe"
              variant="contained"
              color="success"
              onClick={handleSubmit}
            >
              {submitLabel}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default MoreInfo;
