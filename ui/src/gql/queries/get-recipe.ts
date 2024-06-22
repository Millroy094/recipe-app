import { gql } from "@apollo/client";

export default gql`
  query getRecipe($recipeId: String!) {
    getRecipe(recipeId: $recipeId) {
      id
      name
      ingredients {
        name
        measure
        unit
      }
      steps
    }
  }
`;
