import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import http from 'http';
import express from 'express';
import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';

import dynamoose from 'dynamoose';
import dotenv from 'dotenv';

import schema from './graphql';

dotenv.config();

export class Application {
  app = express();

  constructor() {
    this.setupDatabase();
    this.setupApplicationSetting();
    this.setupGraphQL();
  }

  setupDatabase() {
    if (process.env.NODE_ENV === 'development') {
      const ddb = new dynamoose.aws.ddb.DynamoDB({
        endpoint: process.env.DYNAMO_DB_ENDPOINT,
        credentials: {
          accessKeyId: 'LOCAL',
          secretAccessKey: 'LOCAL',
        },
        region: 'local',
      });
      dynamoose.aws.ddb.set(ddb);
    }
  }

  setupApplicationSetting() {
    this.app.use(cors());
    this.app.options('*', cors());
    this.app.use(urlencoded({ extended: false }));
    this.app.use(json());
    // this.app.use(function (req, res, next) {
    //   res.setHeader('Access-Control-Allow-Origin', '*');
    //   res.setHeader('Access-Control-Allow-Credentials', '*');

    //   next();
    // });
  }

  async setupGraphQL() {
    const httpServer = http.createServer(this.app);

    const server = new ApolloServer({
      schema,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        process.env.NODE_ENV === 'development'
          ? ApolloServerPluginLandingPageGraphQLPlayground()
          : null,
      ],
    });

    await server.start();

    this.app.use('/recipe-app/graphql', cors(), expressMiddleware(server));
  }

  listen() {
    this.app.listen(3080, () => console.log('Listening on port 3080'));
  }
}

const application = new Application();

export default application;
