output "endpoint_url" {
  value = aws_apigatewayv2_stage.recipe_api_gw_dev_stage.invoke_url
}
