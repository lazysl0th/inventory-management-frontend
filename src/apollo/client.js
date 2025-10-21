import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';


export default new ApolloClient({
  link: new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL }),
  cache: new InMemoryCache(),
});
