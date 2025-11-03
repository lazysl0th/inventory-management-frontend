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
`

const ITEM_BASE_FRAGMENT = gql`
    fragment ItemBase on Item {
        id
        values {
            id
            value
            field {
                id
                title
                order
            }
        }
    }
`

const USER_BASE_FRAGMENT = gql`
    fragment UserBase on User {
        id
        name
        email
    }
`

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
                customIdFormat {
                    parts {
                        guid
                        type
                        value
                        format
                        position
                        order
                        digits
                    }
                    summary
                }
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

export const GET_INVENTORY_TAB = {
    details: gql`
        query GetInventoryAndCategory($id: Int!) {
            inventory(id: $id) {
                ...InventoryBase
                image
                createdAt
                updatedAt
            }
            categories: __type(name: "Category") {
                name
                enumValues {
                    name
                }
            }
        }
        ${INVENTORY_BASE_FRAGMENT}
    `,
    customId: gql`
        query GetCustomId($id: Int!) {
            inventory(id: $id) {
                ...InventoryBase
                customIdFormat {
                    parts {
                        guid
                        type
                        value
                        format
                        position
                        order
                        digits
                    }
                    summary
                }
            }
        }
        ${INVENTORY_BASE_FRAGMENT}
    `,
    fields: gql`
        query GetInventoryFields($id: Int!) {
            inventory(id: $id) {
                ...InventoryBase
                fields {
                    id
                    title
                    type
                    description
                    showInTable
                    order
                    isDeleted
                }
            }
        }
        ${INVENTORY_BASE_FRAGMENT}
        `,
    access: gql`
        query GetInventoryAccess($id: Int!) {
            inventory(id: $id) {
                ...InventoryBase
                isPublic
                allowedUsers {
                    ...UserBase
                }
            }
        }
        ${INVENTORY_BASE_FRAGMENT}
        ${USER_BASE_FRAGMENT}
    `,
    items: gql`
        query GetItems($inventoryId: Int!) {
            items(inventoryId: $inventoryId) {
                ...ItemBase
            }
            inventory(id: $inventoryId) {
                ...InventoryBase
            }
        }
        ${ITEM_BASE_FRAGMENT}
        ${INVENTORY_BASE_FRAGMENT}
    `,
    chat: gql`
        query GetComments($inventoryId: Int!, $itemId: Int) {
            inventory(id: $inventoryId) {
                ...InventoryBase
            }
            comments: comments(inventoryId: $inventoryId, itemId: $itemId) {
                id
                content
                createdAt
                user {
                    ...UserBase
                }
            }
        }
        ${USER_BASE_FRAGMENT}
        ${INVENTORY_BASE_FRAGMENT}
    `,
    stats: gql`
        query GetInventoryStats($id: Int!) {
            inventory(id: $id) {
                ...InventoryBase
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
        ${INVENTORY_BASE_FRAGMENT}
    `,
};

export const GET_ITEM_TAB = {
    details: gql`
        query GetItem($id: Int!) {
            item(id: $id) {
                ...ItemBase
                owner { name }
                createdAt
                updatedAt
                values { field { type } }
            }
        }
        ${ITEM_BASE_FRAGMENT}
    `,
    chat: gql`
        query GetComments($inventoryId: Int, $itemId: Int) {
            comments: comments(inventoryId: $inventoryId, itemId: $itemId) {
                id
                content
                createdAt
                user {
                    ...UserBase
                }
                
            }
        } 
        ${USER_BASE_FRAGMENT}
    `,
};

export const DELETE_INVENTORY = gql`
    mutation DeleteInventories($ids: [Int!]!) {
        deleteInventories(ids: $ids) {
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
        customIdFormat {
            summary
            parts { guid type value format position order digits }
        }
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
      }
    }
  }
`;