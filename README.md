# Recipe APP

## Introduction
Recipe app is an end to end application allowing an user to add their favourite recipes to their collection. The information stored on this app includes the name of the recipe, ingredients, and the steps.

## Architecture
The application consists of two parts the front-end and back-end. 

The frontend consisting of two pages:
1. Listing page: this is where all the recipes along with their ingredients are displayed. The user can then filter this list via recipe name search or ingredient filter.
2. More info page: this where the user can see more details of their recipe and even update these details.

The backend uses:
1. Dynamo DB to store data.
2. GraphQL Express API to allow CRUD behaviour.

## Infrastructure
The frontend is hosted on an s3 bucket behind AWS CloudFront and the GraphQL backend sits inside a lambda function that communicates with Dynamo DB for storage.

## CI/CD
Update any merge into the main branch a GitHub Action is triggerd that runs:
1. Unit tests on frontend and backend.
2. Builds and deploys website to S3/CloudFront and GraphQL Express Server to AWS Lambda.
3. E2E tests to validate the build and deploy.
