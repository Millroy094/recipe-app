import { Schema, model } from "dynamoose";

const RecipeSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    name: {
      type: String,
    },
    ingredientNames: {
      type: Array,
      schema: [String],
      required: true,
    },
    ingredients: {
      type: Array,
      schema: [
        {
          type: Object,
          schema: {
            name: { type: String, required: true },
            measure: { type: String, required: true },
            unit: {
              type: String,
              required: true,
              enum: [
                "mL",
                "L",
                "dL",
                "tsp",
                "tbsp",
                "oz",
                "cup",
                "gill",
                "pt",
                "qt",
                "gal",
                "mg",
                "g",
                "kg",
                "lb",
                "inch",
                "°C",
                "°F",
              ],
            },
          },
        },
      ],
      required: true,
    },
    steps: {
      type: Array,
      schema: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Recipe = model("Recipe", RecipeSchema);

export default Recipe;
