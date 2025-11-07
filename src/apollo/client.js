import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { SetContextLink } from '@apollo/client/link/context';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL.replace('ws', 'http'), });

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem('token');
  return { headers: { ...prevContext.headers, authorization: token ? `Bearer ${token}` : '' } };
});

const removeTypenameLink = new ApolloLink((operation, forward) => {
    if (operation.variables) {
        operation.variables = JSON.parse(
            JSON.stringify(operation.variables),
            (key, value) => (key === "__typename" ? undefined : value)
        );
    }
    return forward(operation);
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: import.meta.env.VITE_GRAPHQL_URL.replace('http', 'ws'),
        connectionParams: () => ({ authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '', }),
        retryAttempts: 5,
    })
);

const splitLink = ApolloLink.split(
    ({ query }) => {
        const def = getMainDefinition(query);
        return (def.kind === "OperationDefinition" && def.operation === "subscription");
    },
    wsLink,
    ApolloLink.from([authLink, httpLink])
);

const cache = new InMemoryCache({
    typePolicies: {
        Inventory: {
            keyFields: ['id'],
            fields: {
                fields: { keyArgs: false, merge: false },
                allowedUsers: { keyArgs: false, merge: false },
                tags: { keyArgs: false, merge: false },
                owner: { merge: false },
                customIdFormat: { merge: false },
            },
        },
        InventoryField: {
            keyFields: false,
        },
        User: { keyFields: ['id'] },
        Tag: { keyFields: ['id'] },
    },
})

const apolloClient = new ApolloClient({
    link: ApolloLink.from([removeTypenameLink, splitLink]),
    cache,
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