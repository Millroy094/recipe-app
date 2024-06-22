import { gql } from "@apollo/client";

export default gql`
  query getRecipes($search: String, $ingredients: [String!]) {
    getRecipes(search: $search, ingredients: $ingredients) {
      id
      name
      ingredientNames
    }
  }
`;
