resource "aws_apigatewayv2_api" "recipe_api_gw" {
  name          = "recipe-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_headers = ["*"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_origins = ["*"]
    max_age       = 3000
  }
}

resource "aws_cloudwatch_log_group" "recipe_api_gw_log_group" {
  name = "/aws/recipe-api-gw/${aws_apigatewayv2_api.recipe_api_gw.name}"

  retention_in_days = 30
}

resource "aws_apigatewayv2_stage" "recipe_api_gw_dev_stage" {
  api_id = aws_apigatewayv2_api.recipe_api_gw.id

  name        = "recipe-app"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.recipe_api_gw_log_group.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "recipe_api_gw_handler" {
  api_id = aws_apigatewayv2_api.recipe_api_gw.id

  integration_type = "AWS_PROXY"
  integration_uri  = var.recipe_lambda_invoke_arn
}
resource "aws_apigatewayv2_route" "recipe_post_graphql_route" {
  api_id    = aws_apigatewayv2_api.recipe_api_gw.id
  route_key = "POST /graphql"

  target = "integrations/${aws_apigatewayv2_integration.recipe_api_gw_handler.id}"
}
resource "aws_lambda_permission" "recipe_api_gw_lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.recipe_lambda_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.recipe_api_gw.execution_arn}/*/*"
}