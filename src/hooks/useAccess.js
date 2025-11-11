import { useContext, useMemo } from "react";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { isOwner, hasAdminRole, hasAccess } from "../utils/utils";
import { roles } from "../utils/constants";

export default function useAccess(objects) {
    const currentUser = useContext(CurrentUserContext);
    const { readOnly, readAccess, writeAccess, isAdmin } = useMemo(() => {
        if (!currentUser.loggedIn) return { readOnly: true, isAdmin: false, writeAccess: false};
        const auth = currentUser.loggedIn
        const owner = isOwner(objects, currentUser);
        const writeAccess = hasAccess(objects, currentUser);
        const admin = hasAdminRole([roles.ADMIN], currentUser)
        const canEdit = owner || admin;
        return { readOnly: !canEdit, isAdmin: admin, readAccess: auth, writeAccess: writeAccess };
    }, [objects, currentUser]);

    return { readOnly, readAccess, writeAccess, isAdmin };
}
