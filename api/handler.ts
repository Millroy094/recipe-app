import "reflect-metadata";
import serverlessExpress from "@vendia/serverless-express";
import Application from "./web-app";

import {
  Handler,
  Context,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  APIGatewayProxyResult,
  Callback,
} from "aws-lambda";

export const handler: Handler = async (
  event: APIGatewayProxyEventV2,
  apiContext: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResultV2 | void> => {
  const graphqlHandler = serverlessExpress({ app: Application.app });
  return graphqlHandler(event, apiContext, callback);
};
