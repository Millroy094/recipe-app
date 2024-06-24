
resource "random_pet" "recipe_website_bucket_name" {
  prefix = "recipe-website"
  length = 2
}

resource "aws_s3_bucket" "recipe_website_bucket" {
  bucket        = random_pet.recipe_website_bucket_name.id
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "recipe_website_code_s3_configuration" {
  bucket = aws_s3_bucket.recipe_website_bucket.id
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_policy" "recipe_website_bucket_policy" {

  depends_on = [aws_s3_bucket_acl.recipe_website_bucket_acl]

  bucket = aws_s3_bucket.recipe_website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicReadGetObject"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject",
      Resource  = "${aws_s3_bucket.recipe_website_bucket.arn}/*",
    }]
  })
}

resource "aws_s3_bucket_public_access_block" "recipe_website_bucket_public_access_block" {
  bucket                  = aws_s3_bucket.recipe_website_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "recipe_website_ownership_controls" {
  bucket = aws_s3_bucket.recipe_website_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "recipe_website_bucket_acl" {

  depends_on = [aws_s3_bucket_ownership_controls.recipe_website_ownership_controls, aws_s3_bucket_public_access_block.recipe_website_bucket_public_access_block]

  bucket = aws_s3_bucket.recipe_website_bucket.id
  acl    = "public-read"
}

locals {
  timestamp_suffix = timestamp()
}
resource "null_resource" "recipe_website_package_build" {

  depends_on = [ aws_s3_bucket.recipe_website_bucket ]

  triggers = {
    always_run = local.timestamp_suffix
  }
  provisioner "local-exec" {
    command = <<EOT
      FRONTEND_DIR="${path.root}/../ui"

      (cd $FRONTEND_DIR && echo "REACT_APP_GRAPHQL_API_URL=${var.recipe_lambda_url}/graphql" >> .env.production )

      (cd $FRONTEND_DIR && npm ci && npm run build)

      aws s3 sync "$FRONTEND_DIR/build" s3://${aws_s3_bucket.recipe_website_bucket.bucket} --delete --exact-timestamps

    EOT
  }

}
