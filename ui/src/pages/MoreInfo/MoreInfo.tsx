import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Container,
  Divider,
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
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import isEmpty from "lodash/isEmpty";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { useNavigate, useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";

import getRecipeQuery from "../../gql/queries/get-recipe";
import updateRecipeMutation from "../../gql/mutations/update-recipe";
import addRecipeMutation from "../../gql/mutations/add-recipe";

import { useEffect, useState } from "react";
import { UNITS } from "../../constants/units";

interface Ingredient {
  id: string;
  name: string;
  measure: string;
  unit: string;
}

interface Step {
  id: string;
  step: string;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  steps: Step[];
}

interface FormErrors {
  name: string;
  ingredients: Record<string, string>;
  steps: Record<string, string>;
}

const initialFormState = { id: "", name: "", ingredients: [], steps: [] };
const initialFormErrorState = { name: "", ingredients: {}, steps: {} };

const MoreInfo = () => {
  const [form, setForm] = useState<Recipe>(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>(
    initialFormErrorState
  );

  const { id } = useParams();

  const isNew = id === "NEW";

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
  }, [data, loading]);

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
      steps: form.steps.filter((step, i) => i !== index),
    });
  };

  const handleMoveStepUp = (index: number) => {
    console.log(index);
    if (index !== 0) {
      const previousStep = form.steps[index - 1];
      const currentStep = form.steps[index];

      setForm({
        ...form,
        steps: form.steps.map((step, i) => {
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
        steps: form.steps.map((step, i) => {
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
      steps: form.steps.map((step, i) =>
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
      ingredients: form.ingredients.filter((ingredients, i) => i !== index),
    });
  };

  const handleIngredientOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [index, fieldName] = name.split("_");
    setForm({
      ...form,
      ingredients: form.ingredients.map((ingredient, i) =>
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
      ingredients: form.ingredients.map((ingredient, i) =>
        i === parseInt(index) ? { ...ingredient, unit: value } : ingredient
      ),
    });
  };

  const validateForm = (): boolean => {
    let hasErrors = false;
    const errors: FormErrors = { ...initialFormErrorState };

    if (isEmpty(form.name)) {
      errors.name = "Required";
      hasErrors = true;
    }

    if (!isEmpty(form.ingredients)) {
      form.ingredients.forEach((ingredient, index) => {
        if (isEmpty(ingredient.name)) {
          errors.ingredients[`ingredient_${index}_name`] = "Required";
          hasErrors = true;
        }
        if (isEmpty(ingredient.measure)) {
          errors.ingredients[`ingredient_${index}_measure`] = "Required";
          hasErrors = true;
        } else if (!/^[\d/.]+$/.test(ingredient.measure)) {
          errors.ingredients[`ingredient_${index}_measure`] = "Invalid entry";
          hasErrors = true;
        }
        if (isEmpty(ingredient.unit)) {
          errors.ingredients[`ingredient_${index}_measure`] = "Required";
          hasErrors = true;
        }
      });
    } else {
      errors.ingredients["ingredients"] =
        "You need to enter at least one ingredient";
      hasErrors = true;
    }

    if (!isEmpty(form.steps)) {
      form.steps.forEach((step, index) => {
        if (!step.step) {
          errors.steps[`step_${index}`] = "Required";
          hasErrors = true;
        }
      });
    } else {
      errors.steps["steps"] = "You need to enter at least one step";
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
          })
        ),
        steps: [...form.steps.map((step) => step.step)],
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
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              label="Recipe Name"
              fullWidth
              value={name}
              error={!!formErrors.name}
              helperText={formErrors.name ?? ""}
              onChange={onChangeName}
            />
          </Grid>
          <Grid item>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Grid container direction="column">
                  <Typography variant="h6">Ingredients</Typography>
                  {formErrors.ingredients["ingredients"] && (
                    <Typography variant="subtitle1" color="error">
                      {formErrors.ingredients["ingredients"]}
                    </Typography>
                  )}
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {ingredients?.length > 0 ? (
                  <Grid container direction="column" spacing={2}>
                    {ingredients.map((ingredient, index) => (
                      <Grid container item key={ingredient.id} spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            name={`${index}_name`}
                            label="Name"
                            value={ingredient.name}
                            fullWidth
                            onChange={handleIngredientOnChange}
                            error={
                              !!formErrors.ingredients[
                                `ingredient_${index}_name`
                              ]
                            }
                            helperText={
                              formErrors.ingredients[
                                `ingredient_${index}_name`
                              ] ?? ""
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            name={`${index}_measure`}
                            label="Measure"
                            value={ingredient.measure}
                            fullWidth
                            onChange={handleIngredientOnChange}
                            error={
                              !!formErrors.ingredients[
                                `ingredient_${index}_measure`
                              ]
                            }
                            helperText={
                              formErrors.ingredients[
                                `ingredient_${index}_measure`
                              ] ?? ""
                            }
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <FormControl fullWidth>
                            <InputLabel id="unit-select-label">
                              Units
                            </InputLabel>
                            <Select
                              name={`${index}_unit`}
                              labelId="unit-select-label"
                              variant="outlined"
                              fullWidth
                              value={ingredient.unit}
                              onChange={handleIngredientUnitOnChange}
                              error={
                                !!formErrors.ingredients[
                                  `ingredient_${index}_unit`
                                ]
                              }
                            >
                              {UNITS.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                            {formErrors.ingredients[
                              `ingredient_${index}_unit`
                            ] && (
                              <FormHelperText>
                                {
                                  formErrors.ingredients[
                                    `ingredient_${index}_unit`
                                  ]
                                }
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid container item xs={1} justifyContent="center">
                          <IconButton
                            onClick={() => handleRemoveIngredient(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="inherit">
                    "Please press the add button to add ingredients"
                  </Typography>
                )}
              </AccordionDetails>
              <AccordionActions>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddIngredient}
                >
                  Add Ingredient
                </Button>
              </AccordionActions>
            </Accordion>
          </Grid>
          <Grid item>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Grid container direction="column">
                  <Typography variant="h6">Steps</Typography>
                  {formErrors.steps["steps"] && (
                    <Typography variant="subtitle1" color="error">
                      {formErrors.steps["steps"]}
                    </Typography>
                  )}
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {steps?.length > 0 ? (
                  <Grid container direction="column" spacing={2}>
                    {steps.map((step, index) => (
                      <Grid key={step.id} container item>
                        <Grid item xs={10}>
                          <TextField
                            name={`${index}_step`}
                            label={`Step ${index + 1}`}
                            value={step.step}
                            fullWidth
                            onChange={handleStepOnChange}
                            error={!!formErrors.steps[`step_${index}`]}
                            helperText={formErrors.steps[`step_${index}`] ?? ""}
                          />
                        </Grid>
                        <Grid container item xs={2} justifyContent="center">
                          <IconButton
                            onClick={() => handleMoveStepUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUpwardIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleMoveStepDown(index)}
                            disabled={index + 1 >= steps.length}
                          >
                            <ArrowDownwardIcon />
                          </IconButton>
                          <IconButton onClick={() => handleRemoveStep(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="inherit">
                    Please press the add button to add a step
                  </Typography>
                )}
              </AccordionDetails>
              <AccordionActions>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddStep}
                >
                  Add Step
                </Button>
              </AccordionActions>
            </Accordion>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigateToHome()}
            >
              Go back
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="success" onClick={onSubmit}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default MoreInfo;
