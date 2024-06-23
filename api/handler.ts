import 'reflect-metadata';
import serverlessExpress from 'serverless-express';
import app from './web-app';

import {
  Handler,
  Context,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';

export const handler: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2 | void> => {
  serverlessExpress({ app });
};
