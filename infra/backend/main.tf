module "dynamodb" {
  source = "./modules/dynamo-db"
}

module "lambda" {
  source                       = "./modules/lambda"
  recipe_dynamodb_table_arn = module.dynamodb.recipe_dynamodb_table_arn
}

module "apigateway" {
  source                    = "./modules/api-gateway"
  recipe_lambda_invoke_arn    = module.lambda.recipe_lambda_function_invoke_arn
  recipe_lambda_function_name = module.lambda.recipe_lambda_function_name
}
