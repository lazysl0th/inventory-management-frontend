import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';


const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL }),
  cache: new InMemoryCache(),
});

export default apolloClient;