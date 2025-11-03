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

const apolloClient = new ApolloClient({
    link: ApolloLink.from([authLink, removeTypenameLink, httpLink]),
    cache: new InMemoryCache({
        typePolicies:{
            Inventory: {
                keyFields: ['id'],
                fields: {
                    owner: {
                        merge(existing, incoming) {
                            return { ...existing, ...incoming };
                        },
                    },
                    fields: {
                        merge(existing = [], incoming = []) {
                            const byKey = new Map();
                            [...existing, ...incoming].forEach((field) => {
                                const key = field?.id ?? `__title:${field?.title}`;
                                byKey.set(key, { ...byKey.get(key), ...field });
                                return Array.from(byKey.values()).sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
                            })
                        }
                    },
                    customIdFormat: {
                        merge(existing = {}, incoming = {}) {
                            if (!existing) return incoming;
                            const mergedParts = (() => {
                                const existingParts = existing.parts ?? [];
                                const incomingParts = incoming.parts ?? [];
                                const byGuid = new Map();
                                [...existingParts, ...incomingParts].forEach((part) => {
                                    const key = part?.guid ?? `${part?.type}-${part?.order}`;
                                    byGuid.set(key, { ...byGuid.get(key), ...part });
                                });
                                return Array.from(byGuid.values()).sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
                            })();
                            return {
                                ...existing,
                                ...incoming,
                                parts: mergedParts,
                            };
                        },
                    },
                    allowedUsers: {
                        merge(existing = [], incoming = []) {
                            const byId = new Map();
                            [...existing, ...incoming].forEach((user) => byId.set(user.id, { ...byId.get(user.id), ...user }));
                            return Array.from(byId.values()).sort((a, b) => a.name?.localeCompare(b.name));
                        },
                    },
                }
            },
            User: {
                keyFields: ['id'],
            },
        }
    }),
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