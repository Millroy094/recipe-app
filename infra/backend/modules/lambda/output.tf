output "recipe_lambda_function_invoke_arn" {
  description = "Invoke ARN for of the Recipe Lambda function."
  value       = aws_lambda_function.recipe_lambda_function.invoke_arn
}

output "recipe_lambda_function_name" {
  description = "Name for of the Recipe Lambda function."
  value       = aws_lambda_function.recipe_lambda_function.function_name
}
