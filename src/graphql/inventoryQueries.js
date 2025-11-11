import { gql } from "@apollo/client";

const INVENTORY_BASE_FRAGMENT = gql`
    fragment InventoryBase on Inventory {
        id
        title
        description
        category
        owner { id name }
        itemsCount
    }
`;

const USER_BASE_FRAGMENT = gql`
    fragment UserBase on User {
        id
        name
        email
    }
`;

export const GET_INVENTORIES = gql`
    query SelectInventories(
        $sortName: String,
        $order: SortOrder,
        $take: Int,
        $ownerId: Int,
        $isPublic: Boolean,
        $allowedUser: Int,
        $logic: String
    ) {
        inventories(
            sortName: $sortName, 
            order: $order, 
            take: $take
            ownerId: $ownerId,
            isPublic: $isPublic,
            allowedUser: $allowedUser,
            logic: $logic
        ) {
            ...InventoryBase
        }
    }
    ${INVENTORY_BASE_FRAGMENT}
`;



export const SEARCH_INVENTORIES = gql`
    query SearchInventories($searchQuery: String! $orderBy: String!) {
        searchInventories(searchQuery: $searchQuery, orderBy: $orderBy) {
            id
            title
            description
            owner {
                id
                name
            }
            highlightedTitle
            highlightedDescription
        }
    }
`

export const GET_INVENTORY = gql`
        query GetInventory($id: Int!) {
            inventory(id: $id) {
                ...InventoryBase
                image
                createdAt
                updatedAt
                customIdFormat
                fields {
                    id
                    title
                    type
                    description
                    showInTable
                    order
                    isDeleted
                }
                isPublic
                tags {
                    id
                    name
                }
                allowedUsers {
                    ...UserBase
                }
                version
            }
        }
        ${USER_BASE_FRAGMENT}
        ${INVENTORY_BASE_FRAGMENT}
`;

export const GET_INVENTORY_INFO = gql`
    query GetInventoryFields($id: Int!) {
        inventory(id: $id) {
            id
            allowedUsers {
                id
            }
            owner {
                id
            }
            customIdFormat
            fields {
                id
                title
                type
                showInTable
                order
                isDeleted
            }
        }
    }
`;

export const DELETE_INVENTORIES = gql`
    mutation DeleteInventories($ids: [Int!]!) {
        deleteInventories(ids: $ids) {
            id
        }
    }
`;

export const CREATE_INVENTORY = gql`
    mutation createInventory($input: CreateInventoryInput!) {
        createInventory(input: $input) {
            id
            title
            description
            category
            image
            isPublic
            title
        }
    }
`;

export const UPDATE_INVENTORY = gql`
    mutation UpdateInventory($id: Int!, $input: CreateInventoryInput!, $expectedVersion: Int!) {
        updateInventory(id: $id, input: $input, expectedVersion: $expectedVersion) {
            id
            title
            description
            category
            image
            isPublic
            customIdFormat
            tags { id name }
            fields {
                id
                title
                type
                description
                showInTable
                order
                isDeleted
            }
            version
            updatedAt
            itemsCount
        }
    }
`;

export const GET_INVENTORY_STATS = gql`
    query GetInventoryStats($id: Int!) {
        inventory(id: $id) {
        id
        title
            stats {
                numStats {
                    field
                    average
                    min
                    max
                }
                textStats {
                    field
                    topValues {
                        value
                        count
                    }
                }
            }
        }
    }
`;

