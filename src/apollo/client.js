import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
