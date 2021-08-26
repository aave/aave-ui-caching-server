import { Query, Resolver } from 'type-graphql';

@Resolver()
export class HealthResolver {
  @Query(() => String)
  ping(): string {
    return 'pong';
  }
}
