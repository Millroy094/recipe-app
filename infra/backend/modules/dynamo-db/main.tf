resource "aws_dynamodb_table" "recipe_dynamodb_table" {
  name           = "recipe"
  hash_key       = "id"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  attribute {
    name = "id"
    type = "S"
  }
}
