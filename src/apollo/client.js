import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const apolloClient = new ApolloClient({
    link: new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL }),
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