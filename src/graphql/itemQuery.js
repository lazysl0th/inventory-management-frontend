import { gql } from "@apollo/client";

const ITEM_BASE_FRAGMENT = gql`
    fragment ItemBase on Item {
        id
        version
        customId
        values {
            id
            value
            field {
                id
                title
                type
                order
                showInTable
                isDeleted
            }
        }
    }
`;

export const GET_ITEMS = gql`
    query GetItems($inventoryId: Int!) {
        items(inventoryId: $inventoryId) {
            ...ItemBase
        }
    }
    ${ITEM_BASE_FRAGMENT}
`;

export const GET_ITEM = gql`
    query GetItem($id: Int!) {
        item(id: $id) {
            ...ItemBase
            owner {
                id
                name
            }
            version
            createdAt
            updatedAt
        }
    }
    ${ITEM_BASE_FRAGMENT}
`;

export const CREATE_ITEM = gql`
    mutation createItem($input: CreateItemInput!) {
        createItem(input: $input) {
            id
        }
    }
`;

export const DELETE_ITEMS = gql`
    mutation DeleteItems($ids: [Int!]!) {
        deleteItems(ids: $ids) {
            id
        }
    }
`;

export const UPDATE_ITEM = gql`
    mutation UpdateItem($id: Int!, $input: CreateItemInput!, $expectedVersion: Int!) {
        updateItem(id: $id, input: $input, expectedVersion: $expectedVersion) {
            id
            version
            customId
            createdAt
            updatedAt
            owner {
                id
                name
            }
            values {
                field {
                    id
                    title
                }
                value
            }
            likesCount
            likedByMe
        }
    }
`;