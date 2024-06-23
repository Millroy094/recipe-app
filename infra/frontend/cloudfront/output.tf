

output "react_recipe_website_endpoint" {
  value = aws_cloudfront_distribution.recipe_distribution.domain_name
}

