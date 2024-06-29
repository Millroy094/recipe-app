import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Ingredient, Recipe, RecipeFormData, Step } from "./type";
import IngredientList from "./IngredientList";
import StepList from "./StepList";
import schema from "./schema";

const initialFormState = { id: "", name: "", ingredients: [], steps: [] };

const MoreInfo: FC<{
  data: any;
  onSubmit: (formData: RecipeFormData) => Promise<void>;
  navigateToHome: () => void;
  submitLabel: string;
}> = (props) => {
  const { data, onSubmit, navigateToHome, submitLabel } = props;
  const [form, setForm] = useState<Recipe>(initialFormState);

  const {
    register,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<Recipe>({
    //@ts-ignore
    resolver: yupResolver(schema),
    values: form,
  });

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

  const onSubmitSubmitFormData = async (data: any) => {
    const formData: RecipeFormData = {
      id: data.id,
      name: data.name,
      ingredients: data.ingredients.map(
        ({ name, measure, unit }: Ingredient) => ({
          name,
          measure,
          unit,
        })
      ),
      steps: [...data.steps.map((step: Step) => step.step)],
    };
    await onSubmit(formData);
  };

  return (
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              data-testid="recipeName"
              label="Recipe Name"
              fullWidth
              {...register("name", { required: false })}
              error={!!errors.name}
              helperText={errors.name?.message ?? ""}
            />
          </Grid>
          <Grid item>
            <IngredientList
              getValues={getValues}
              register={register}
              control={control}
              errors={errors}
            />
          </Grid>

          <Grid item>
            <StepList register={register} control={control} errors={errors} />
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
              onClick={handleSubmit(onSubmitSubmitFormData)}
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
