import { ApolloServer } from 'apollo-server-express';
import 'reflect-metadata';
import { buildSchema, NonEmptyArray } from 'type-graphql';
import {
  HealthResolver,
  ProtocolDataResolver,
  IncentivesDataResolver,
  StakeDataResolver,
} from './graphql/resolvers';
import { getPubSub } from './pubsub';
import { isStakeEnabled } from './tasks/task-helpers';
import express from 'express';
import * as WebSocket from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = isStakeEnabled()
    ? [ProtocolDataResolver, HealthResolver, IncentivesDataResolver, StakeDataResolver]
    : [ProtocolDataResolver, IncentivesDataResolver, HealthResolver];

  const schema = await buildSchema({
    resolvers,
    pubSub: getPubSub(),
  });

  const app = express();

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
  });

  await server.start();

  server.applyMiddleware({ app });

  try {
    // Start the server
    const server = await app.listen(PORT, () => {
      const wsServer = new WebSocket.Server({
        server,
        path: '/graphql',
      });
      useServer({ schema }, wsServer);
    });
  } catch (e) {
    console.error('Apollo server exited with', e);
    process.exit(1);
  }
}

bootstrap();
