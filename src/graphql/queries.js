import { gql } from "@apollo/client";

export const GET_INVENTORIES = gql`
  query GetInventories {
    inventories {
        id
        title
        description
        category
        image
        itemsCount
        updatedAt
    }
  }
`;

export const GET_LATEST_INVENTORIES = gql`
    query GetLatestInventories($take: Int!, $orderBy: InventoryByConditialInput) {
        selectInventories(orderBy: $orderBy, take: $take) {
            id
            title
            description
            image
            owner { name }
            createdAt
        }
    }
`;

export const GET_TOP_INVENTORIES = gql`
    query GetTopInventories($take: Int!, $orderBy: InventoryByConditialInput) {
        selectInventories(orderBy: $orderBy, take: $take) {
            id
            title
            description
            image
            owner { name }
            itemsCount
        }
    }
`;

export const GET_TAGS = gql`
    query {
        selectTags {
            id
            name
            inventoriesCount
        }
    }
`;
