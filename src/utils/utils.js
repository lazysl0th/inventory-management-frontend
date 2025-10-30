import { MouseSensor, TouchSensor } from "@dnd-kit/core";

export const isOwner = (objects, user) => objects.every(object => object.ownerId == user.id);

export const hasAdminRole = (requiredRoles, user) => user.roles.some((userRole) => requiredRoles.includes(userRole.role.name));

export const hasAccess = (objects, user) => {
    return objects.every((object) => object.isPublic || (object.allowedUsers?.some((allowedUser) => user.id == allowedUser.id)));
}

export class SafeMouseSensor extends MouseSensor {
    static activators = [{
        eventName: "onMouseDown",
        handler: ({ nativeEvent }) => {
            const t = nativeEvent.target;
            return !(t.closest("input, textarea, select, option, button, a") || t.isContentEditable);
        },
    }];
}

export class SafeTouchSensor extends TouchSensor {
    static activators = [{
        eventName: "onTouchStart",
        handler: ({ nativeEvent }) => {
            const t = nativeEvent.target;
            return !(t.closest("input, textarea, select, option, button, a") || t.isContentEditable);
        },
    }];
}

export const getAvailableParts = (partsDefinitions) => (Object.entries(partsDefinitions).map(([type, def]) => ({ type, label: def.label })));

export const IdGenerator = {
    generatePart(partDefinition, part, index = 0) {
        const def = partDefinition[part.type];
        if (!def || typeof def.gen !== "function") return "";

        const main = def.gen(part, index) || "";
        const val = part.value || "";
        const pos = part.position || "prefix";

        if (part.type === "TEXT") return main;

        return pos === "suffix" ? main + val : val + main;
    },

    generateFromParts(parts = []) {
        return parts.map((p, i) => IdGenerator.generatePart(p, i)).filter(Boolean).join("");
    },
};