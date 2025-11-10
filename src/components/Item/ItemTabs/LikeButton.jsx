import { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from "@apollo/client/react";
import { TOGGLE_LIKE, GET_ITEM_LIKES } from "../../../graphql/queries";

export default function LikeButton({ itemId, readAccess, onShowToast }) {
    const { t } = useTranslation("item");
    const { data, loading: loadingLikes, error } = useQuery(GET_ITEM_LIKES, {
        variables: { id: itemId },
        skip: !itemId,
        fetchPolicy: "cache-first",
    });

    const [localState, setLocalState] = useState({
        likesCount: 0,
        likedByMe: false,
    });

    const [toggleLike, { loading: loadingMutation }] = useMutation(TOGGLE_LIKE, {
        onCompleted: ({ toggleLikeItem }) => {
        setLocalState({
            likesCount: toggleLikeItem.likesCount,
            likedByMe: toggleLikeItem.likedByMe,
        });
        },
    });

    useEffect(() => {
        if (data?.item) {
            setLocalState({
                likesCount: data.item.likesCount,
                likedByMe: data.item.likedByMe,
            });
        }
    }, [data]);

    const like = async (optimistic) => {
        await toggleLike({
            variables: { id: itemId },
            optimisticResponse: {
                __typename: "Mutation",
                toggleLikeItem: {
                    __typename: "Item",
                    id: itemId,
                    ...optimistic,
                },
            },
        });
    }

    const handleLike = async () => {
        if (!readAccess) return onShowToast(t("toasts.like"), "bottom-center")
        const optimistic = {
            likedByMe: !localState.likedByMe,
            likesCount: localState.likedByMe
                ? localState.likesCount - 1
                : localState.likesCount + 1,
        };
        setLocalState(optimistic);
        try {
        like(optimistic);
        } catch (e) {
            console.error(e);
            onShowToast(t("toasts.errorLike"), "bottom-center");
            if (data?.item) {
                setLocalState({
                    likesCount: data.item.likesCount,
                    likedByMe: data.item.likedByMe,
                });
            }
        }
    };

  if (loadingLikes) return <Spinner size="sm" />;
  if (error) return null;

  return (
    <Button
        className="d-flex align-items-center gap-1"
        onClick={handleLike}
        disabled={loadingMutation}
        variant='primary'
    >
        <FaHeart className={localState.likedByMe ? "text-danger" : ""} />
        <span>{localState.likesCount}</span>
    </Button>
  );
}
