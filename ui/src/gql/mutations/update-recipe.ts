import { gql } from "@apollo/client";

export default gql`
  mutation updateRecipe($recipeInput: RecipeInput!) {
    updateRecipe(recipeInput: $recipeInput)
  }
`;
