import { AuthOptions } from 'aws-appsync-auth-link';
import cdkOutput from '../output.json';
import { Auth } from 'aws-amplify';
import {
  ApolloClient,
  ApolloLink,
  gql,
  HttpLink,
  InMemoryCache
} from '@apollo/client';
import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import {
  isLoggedInVar,
  subInVar,
  typeDefs
} from '../graphql';

/**
 * Configure AppSync client
 */
const httpLink = new HttpLink({
  uri: cdkOutput.FULAppSyncAPIStack.GraphQLAPIURL
});

export const configureAppSyncClient = () => {
  const url = cdkOutput.FULAppSyncAPIStack.GraphQLAPIURL; // TODO: duplicated url?
  const region = 'us-east-1';

  const auth: AuthOptions = {
    type: 'AMAZON_COGNITO_USER_POOLS',
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken()
    //credentials: async () => credentials, // Required when using IAM-based auth.
  };

  const link = ApolloLink.from([
    createAuthLink({ url, region, auth }),
    createSubscriptionHandshakeLink({ url, region, auth }, httpLink)
  ]);

  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            isLoggedIn: {
              read() {
                return isLoggedInVar();
              }
            },
            sub: {
              read() {
                return subInVar();
              }
            }
          }
        }
      }
    }),
    connectToDevTools: true,
    typeDefs: gql(typeDefs)
  });
};
