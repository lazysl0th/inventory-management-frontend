import { gql } from "@apollo/client";

const INVENTORY_BASE_FRAGMENT = gql`
    fragment InventoryBase on Inventory {
        id
        title
        description
        category
        owner { name }
        itemsCount
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
        $sortName: String!,
        $order: SortOrder!,
        $take: Int!
    ) {
        inventories(
            sortName: $sortName, 
            order: $order, 
            take: $take
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
            inventoriesCount
        }
    }
`;

export const SEARCH_INVENTORIES = gql`
    query SearchInventories($searchQuery: String! $orderBy: String!) {
        inventories(searchQuery: $searchQuery, orderBy: $orderBy) {
            id
            category
            owner { name }
            highlightedTitle
            highlightedDescription
        }
    }
`

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
                        type
                        value
                        format
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
            items: items(inventoryId: $inventoryId) {
                id
                values {
                    id
                    value
                    field {
                        id
                        title
                        description
                    }
                }
            }
        }
    `,
    chat: gql`
        query GetComments($inventoryId: Int, $itemId: Int) {
            comments: comments(inventoryId: $inventoryId, itemId: $itemId) {
                id
                content
                createdAt
                user {
                    id
                    name
                    email
                }
            }
        }
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

export const GET_ITEMS = gql`
    query SelectItems($id: Int!) {
        items(id: $id) {
            id
            title
            description
            items {
                id
                customId
                createdAt
                updatedAt
                values {
                    id
                    value
                }
            }
        }
    }
`;