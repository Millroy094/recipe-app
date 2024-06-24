import { Schema, model } from 'dynamoose';

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
                'mL',
                'L',
                'tsp',
                'tbsp',
                'oz',
                'cup',
                'qty',
                'g',
                'kg',
                'lb',
                'inch',
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
  },
);
const Recipe = model('Recipe', RecipeSchema);

export default Recipe;
