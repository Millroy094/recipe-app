import { FC, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import MoreInfo from "./MoreInfo";

import getRecipeQuery from "../../gql/queries/get-recipe";
import updateRecipeMutation from "../../gql/mutations/update-recipe";
import addRecipeMutation from "../../gql/mutations/add-recipe";
import { RecipeFormData } from "./type";

const MoreInfoContainer: FC<{}> = () => {
  const { id } = useParams();
  const isNew = id === "NEW";

  const [getRecipe, { loading, data }] = useLazyQuery(getRecipeQuery);
  const navigate = useNavigate();

  const [updateRecipe] = useMutation(updateRecipeMutation);
  const [addRecipe] = useMutation(addRecipeMutation);

  const onSubmit = async (formData: RecipeFormData): Promise<void> => {
    if (isNew) {
      formData.id = uuidv4();
      await addRecipe({ variables: { recipeInput: formData } });
      navigate(`/recipe/${formData.id}`);
    } else {
      await updateRecipe({ variables: { recipeInput: formData } });
    }
  };

  const navigateToHome = () => {
    navigate(`/`);
  };

  useEffect(() => {
    if (!isNew) {
      getRecipe({ variables: { recipeId: id } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "1000px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress data-testid="recipe-progress-bar" color="success" />
      </Box>
    );
  }

  return (
    <MoreInfo
      data={data}
      onSubmit={onSubmit}
      navigateToHome={navigateToHome}
      submitLabel={isNew ? "Create" : "Save"}
    />
  );
};

export default MoreInfoContainer;
