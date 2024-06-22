import { gql } from "@apollo/client";

export default gql`
  mutation addRecipe($recipeInput: RecipeInput!) {
    addRecipe(recipeInput: $recipeInput)
  }
`;
