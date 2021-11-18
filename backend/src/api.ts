import { ApolloServer } from 'apollo-server';
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

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = isStakeEnabled()
    ? [ProtocolDataResolver, HealthResolver, IncentivesDataResolver, StakeDataResolver]
    : [ProtocolDataResolver, IncentivesDataResolver, HealthResolver];

  const schema = await buildSchema({
    resolvers,
    pubSub: getPubSub(),
  });

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
    playground: true,
    subscriptions: { keepAlive: 1000 * 20 },
  });

  try {
    // Start the server
    const { url, subscriptionsUrl } = await server.listen(PORT);
    console.log(
      `Server is running, GraphQL Playground available at ${url}, and subscriptions are on ${subscriptionsUrl}`
    );
  } catch (e) {
    console.error('Apollo server exited with', e);
    process.exit(1);
  }
}

bootstrap();
