locals {
  timestamp_suffix = timestamp()
}

resource "null_resource" "recipe_lambda_package_build" {
  triggers = {
    always_run = local.timestamp_suffix
  }
  provisioner "local-exec" {
    command = <<EOT
      BACKEND_SOURCE_DIR="${path.root}/../api"
      cd $BACKEND_SOURCE_DIR 
      npm ci
      npm run build

      cp "$BACKEND_SOURCE_DIR/package.json" "$BACKEND_SOURCE_DIR/dist"
      cp "$BACKEND_SOURCE_DIR/package-lock.json" "$BACKEND_SOURCE_DIR/dist"

      cd "$BACKEND_SOURCE_DIR/dist"
      npm ci --production

    EOT
  }

}

data "archive_file" "archive_recipe_lambda" {
  type        = "zip"
  source_dir  = "${path.root}/../api/dist"
  output_path = "${path.root}/../api/recipe-lambda_${local.timestamp_suffix}.zip"

  depends_on = [ null_resource.recipe_lambda_package_build ]
}

resource "random_pet" "lambda_bucket_name" {
  prefix = "lambda"
  length = 2
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket        = random_pet.lambda_bucket_name.id
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "lambda_bucket" {
  bucket = aws_s3_bucket.lambda_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_object" "recipe_lambda_code_s3_object" {
  bucket = aws_s3_bucket.lambda_bucket.id
  key    = "recipe-lambda.zip"
  source = data.archive_file.archive_recipe_lambda.output_path
  etag   = filemd5(data.archive_file.archive_recipe_lambda.output_path)
}

resource "aws_cloudwatch_log_group" "lambda_logs" {
  name = "/aws/lambda/${aws_lambda_function.recipe_lambda_function.function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "recipe_lambda_exec" {
  name = "recipe_lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "recipe_lambda_policy" {
  role       = aws_iam_role.recipe_lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "recipe_lambda_dynamo_db_policy" {
  name = "recipe_lambda_dynamo_db_policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:*"
        ]
        Resource = [
          var.recipe_dynamodb_table_arn
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "recipe_lambda_dynamo_db_policy_attachment" {
  role       = aws_iam_role.recipe_lambda_exec.name
  policy_arn = aws_iam_policy.recipe_lambda_dynamo_db_policy.arn
}


resource "aws_lambda_function" "recipe_lambda_function" {
  function_name = "recipe"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.recipe_lambda_code_s3_object.key

  source_code_hash = data.archive_file.archive_recipe_lambda.output_base64sha256

  runtime = "nodejs20.x"
  handler = "handler.handler"

  memory_size = 1024
  timeout     = 60

  role = aws_iam_role.recipe_lambda_exec.arn
  environment {
    variables = {
      NODE_ENV = "production"
    }
  }
}

