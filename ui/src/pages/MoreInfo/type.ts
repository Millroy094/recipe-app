export interface Ingredient {
  id: string;
  name: string;
  measure: string;
  unit: string;
}

export interface Step {
  id: string;
  step: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  steps: Step[];
}

export interface FormErrors {
  name: string;
  ingredients: Record<string, string>;
  steps: Record<string, string>;
}
