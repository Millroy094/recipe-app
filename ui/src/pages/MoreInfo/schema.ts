import { object, string, array } from "yup";

const schema = object({
  name: string().required(),
  steps: array()
    .of(
      object({ id: string().required(), step: string().required() }).required()
    )
    .required()
    .min(1),
  ingredients: array()
    .of(
      object({
        id: string().required(),
        name: string().required(),
        measure: string()
          .required()
          .matches(/^[\d/.]+$/),
        unit: string().required(),
      })
    )
    .required()
    .min(1),
});

export default schema;
