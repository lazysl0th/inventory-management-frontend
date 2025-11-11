import { gql } from "@apollo/client";

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

export const SEARCH_USERS = gql`
  query SearchUsers($searchQuery: String!, $by: SearchBy!) {
    searchUsers(searchQuery: $searchQuery, by: $by) {
      id
      name
      email
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

export const GET_ITEM_LIKES = gql`
  query GetItemLikes($id: Int!) {
    item(id: $id) {
      id
      likesCount
      likedByMe
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