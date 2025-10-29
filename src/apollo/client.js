import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';

const httpLink = new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL });

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem('token');
  return { headers: { ...prevContext.headers, authorization: token ? `Bearer ${token}` : '' } };
});

const apolloClient = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "cache-and-network",
            returnPartialData: true,
            notifyOnNetworkStatusChange: true,
        },
        query: {
            fetchPolicy: "cache-and-network",
            returnPartialData: true,
            notifyOnNetworkStatusChange: true,
        },
    }
});

export default apolloClient;