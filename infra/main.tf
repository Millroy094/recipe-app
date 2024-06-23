provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

module "backend" {
  source                       = "./backend"
}

# module "frontend" {
#   source          = "./frontend"
#   auth_lambda_url = module.backend.endpoint_url
#   backend         = module.backend
# }
