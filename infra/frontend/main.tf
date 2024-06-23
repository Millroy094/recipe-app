module "website" {
  source                      = "./website"
  recipe_lambda_url             = var.recipe_lambda_url
}

module "cloudfront" {
  source = "./cloudfront"
  recipe_bucket_regional_domain_name = module.website.recipe_bucket_regional_domain_name
    depends_on                  = [module.website]
}