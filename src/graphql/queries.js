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
        likesCount
        likedByMe
    }
`;

const USER_BASE_FRAGMENT = gql`
    fragment UserBase on User {
        id
        name
        email
    }
`;

export const GET_TAGS = gql`
    query SelectTags {
        tags {
            id
            name
            inventories {
                id
            }
            inventoriesCount
        }
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

export const SEARCH_TAGS = gql`
    query SearchTags($searchQuery: String!) {
        searchTags(searchQuery: $searchQuery) {
            id
            name
        }
    }
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
        query GetInventoryAndCategory($id: Int!) {
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
                allowedUsers {
                    ...UserBase
                }
                version
            }
            categories: __type(name: "Category") {
                name
                enumValues {
                    name
                }
            }
        }
        ${USER_BASE_FRAGMENT}
        ${INVENTORY_BASE_FRAGMENT}
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
            createdAt
            updatedAt
        }
    }
    ${ITEM_BASE_FRAGMENT}
`;

export const GET_INVENTORY_FIELDS = gql`
    query GetInventoryFields($id: Int!) {
        inventory(id: $id) {
            id
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

export const CREATE_ITEM = gql`
    mutation createItem($input: CreateItemInput!) {
        createItem(input: $input) {
            id
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

export const DELETE_ITEMS = gql`
    mutation DeleteItems($ids: [Int!]!) {
        deleteItems(ids: $ids) {
            id
        }
    }
`;

export const GET_CATEGORIES = gql`
    query GetCategory {
        categories: __type(name: "Category") {
            name
            enumValues {
                name
            }
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

export const SEARCH_USERS = gql`
  query SearchUsers($searchQuery: String!, $by: SearchBy!) {
    searchUsers(searchQuery: $searchQuery, by: $by) {
      id
      name
      email
    }
  }
`;

export const INVENTORY_CORE = gql`
    fragment InventoryCore on Inventory {
        id
        title
        description
        category
        image
        isPublic
        owner { id name }
        createdAt
        updatedAt
        version
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
        customIdFormat
        itemsCount
  }
`;

export const GET_INVENTORY_NEW = gql`
  query GetInventory($id: Int!) {
    inventory(id: $id) {
      ...InventoryCore
    }
  }
  ${INVENTORY_CORE}
`;

export const UPDATE_INVENTORY = gql`
  mutation UpdateInventory($id: Int!, $input: CreateInventoryInput!) {
    updateInventory(id: $id, input: $input) {
      ...InventoryCore
    }
  }
  ${INVENTORY_CORE}
`;

export const UPDATE_INVENTORY_NEW = gql`
    mutation UpdateInventory($id: Int!, $input: CreateInventoryInput!, $expectedVersion: Int!) {
        updateInventory(id: $id, input: $input, expectedVersion: $expectedVersion) {
            id
            title
            version
            updatedAt
            tags {
                id
                name
            }
            fields {
                id
                title
                order
                showInTable
            }
        }
    }
`;

export const UPDATE_ITEM = gql`
    mutation UpdateItem($id: Int!, $input: CreateItemInput!, $expectedVersion: Int!) {
        updateItem(id: $id, input: $input, expectedVersion: $expectedVersion) {
            id
            version
            updatedAt
        }
    }
`;

export const TOGGLE_LIKE = gql`
    mutation ToggleLikeItem($id: Int!) {
        toggleLikeItem(id: $id) {
            id
            likesCount
            likedByMe
            __typename
        }
    }
`;

export const GET_COMMENTS = gql`
    query GetComments($inventoryId: Int!) {
        comments(inventoryId: $inventoryId) {
            id
            content
            createdAt
            user {
                id
                name
            }
        }
    }
`;

export const CREATE_COMMENT = gql`
    mutation CreateComment($input: CreateCommentInput!) {
        createComment(input: $input) {
            id
            content
            createdAt
            user {
                id
                name
            }
        }
    }
`;

export const COMMENT_ADDED = gql`
    subscription OnCommentAdded($inventoryId: Int!) {
        commentAdded(inventoryId: $inventoryId) {
            id
            content
            createdAt
            user {
                id
                name
            }
        }
    }
`;