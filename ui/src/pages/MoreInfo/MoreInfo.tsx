import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import isEmpty from 'lodash/isEmpty';

import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';

import getRecipeQuery from '../../gql/queries/get-recipe';
import updateRecipeMutation from '../../gql/mutations/update-recipe';
import addRecipeMutation from '../../gql/mutations/add-recipe';

import { UNITS } from '../../constants/units';
import AddItemAccordion from './AddItemAccordion';
import { FormErrors, Ingredient, Recipe, Step } from './type';
import IngredientList from './IngredientList/IngredientList';
import StepList from './StepList';

const initialFormState = { id: '', name: '', ingredients: [], steps: [] };
const initialFormErrorState = { name: '', ingredients: {}, steps: {} };

const MoreInfo = () => {
  const [form, setForm] = useState<Recipe>(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>(
    initialFormErrorState,
  );

  const { id } = useParams();

  const isNew = id === 'NEW';

  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate(`/`);
  };

  const [updateRecipe] = useMutation(updateRecipeMutation);
  const [addRecipe] = useMutation(addRecipeMutation);

  const [getRecipe, { loading, data }] = useLazyQuery(getRecipeQuery);

  useEffect(() => {
    getRecipe({ variables: { recipeId: id } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && data) {
      const { getRecipe } = data;

      setForm({
        ...getRecipe,
        ingredients: [
          ...getRecipe.ingredients.map(
            (ingredient: { name: string; measure: string; unit: string }) => ({
              ...ingredient,
              id: uuidv4(),
            }),
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
  }, [data, loading]);

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      name: e.target.value,
    });
  };

  const handleAddStep = () => {
    setForm({ ...form, steps: [...form.steps, { id: uuidv4(), step: '' }] });
  };

  const handleRemoveStep = (index: number) => {
    setForm({
      ...form,
      steps: form.steps.filter((step: Step, i: number) => i !== index),
    });
  };

  const handleMoveStepUp = (index: number) => {
    console.log(index);
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
    const [index] = name.split('_');
    setForm({
      ...form,
      steps: form.steps.map((step: Step, i: number) =>
        i === parseInt(index) ? { ...step, step: value } : step,
      ),
    });
  };

  const handleAddIngredient = () => {
    setForm({
      ...form,
      ingredients: [
        ...form.ingredients,
        { id: uuidv4(), name: '', measure: '', unit: '' },
      ],
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setForm({
      ...form,
      ingredients: form.ingredients.filter(
        (ingredient: Ingredient, i: number) => i !== index,
      ),
    });
  };

  const handleIngredientOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [index, fieldName] = name.split('_');
    setForm({
      ...form,
      ingredients: form.ingredients.map((ingredient: Ingredient, i: number) =>
        i === parseInt(index)
          ? { ...ingredient, [fieldName]: value }
          : ingredient,
      ),
    });
  };

  const handleIngredientUnitOnChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    const [index] = name.split('_');
    setForm({
      ...form,
      ingredients: form.ingredients.map((ingredient: Ingredient, i: number) =>
        i === parseInt(index) ? { ...ingredient, unit: value } : ingredient,
      ),
    });
  };

  const validateForm = (): boolean => {
    let hasErrors = false;
    const errors: FormErrors = { ...initialFormErrorState };

    if (isEmpty(form.name)) {
      errors.name = 'Required';
      hasErrors = true;
    }

    if (!isEmpty(form.ingredients)) {
      form.ingredients.forEach((ingredient: Ingredient, index: number) => {
        if (isEmpty(ingredient.name)) {
          errors.ingredients[`ingredient_${index}_name`] = 'Required';
          hasErrors = true;
        }
        if (isEmpty(ingredient.measure)) {
          errors.ingredients[`ingredient_${index}_measure`] = 'Required';
          hasErrors = true;
        } else if (!/^[\d/.]+$/.test(ingredient.measure)) {
          errors.ingredients[`ingredient_${index}_measure`] = 'Invalid entry';
          hasErrors = true;
        }
        if (isEmpty(ingredient.unit)) {
          errors.ingredients[`ingredient_${index}_unit`] = 'Required';
          hasErrors = true;
        }
      });
    } else {
      errors.ingredients['ingredients'] =
        'You need to enter at least one ingredient';
      hasErrors = true;
    }

    if (!isEmpty(form.steps)) {
      form.steps.forEach((step: Step, index: number) => {
        if (!step.step) {
          errors.steps[`step_${index}`] = 'Required';
          hasErrors = true;
        }
      });
    } else {
      errors.steps['steps'] = 'You need to enter at least one step';
      hasErrors = true;
    }

    setFormErrors(errors);

    console.log(errors);

    return hasErrors;
  };

  const onSubmit = async () => {
    const hasErrors = validateForm();

    if (!hasErrors) {
      const formData = {
        id: form.id,
        name: form.name,
        ingredients: form.ingredients.map(
          ({ name, measure, unit }: Ingredient) => ({
            name,
            measure,
            unit,
          }),
        ),
        steps: [...form.steps.map((step: Step) => step.step)],
      };

      if (isNew) {
        formData.id = uuidv4();
        await addRecipe({ variables: { recipeInput: formData } });
        navigate(`/recipe/${formData.id}`);
      } else {
        await updateRecipe({
          variables: {
            recipeInput: formData,
          },
        });
      }
    }
  };

  const { name, ingredients, steps } = form;

  return (
    <Container maxWidth='lg' sx={{ p: 2 }}>
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2} direction='column'>
          <Grid item>
            <TextField
              data-testid='recipeName'
              label='Recipe Name'
              fullWidth
              value={name}
              error={!!formErrors.name}
              helperText={formErrors.name ?? ''}
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
        <Grid container spacing={2} justifyContent='flex-end'>
          <Grid item>
            <Button
              data-testid='goBack'
              variant='contained'
              color='secondary'
              onClick={() => navigateToHome()}
            >
              Go back
            </Button>
          </Grid>
          <Grid item>
            <Button
              data-testid='submitRecipe'
              variant='contained'
              color='success'
              onClick={onSubmit}
            >
              {isNew ? 'Create' : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default MoreInfo;
