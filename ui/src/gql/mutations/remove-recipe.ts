import { gql } from "@apollo/client";

export default gql`
  mutation removeRecipe($recipeId: String!) {
    removeRecipe(recipeId: $recipeId)
  }
`;
