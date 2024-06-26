import { object, string, array } from "yup";

const schema = object({
  name: string().required(),
  steps: array()
    .of(object({ step: string().required() }).required())
    .min(1),
  ingredients: array()
    .of(
      object({
        name: string().required(),
        measure: string()
          .required()
          .matches(/^[\d/.]+$/),
        unit: string().required(),
      })
    )
    .min(1),
});

export default schema;