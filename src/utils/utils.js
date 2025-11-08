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
    generatePart(partDefinitions, part) {
        if (!part) return "";
        const def = partDefinitions?.[part?.type];
        if (!def || typeof def.gen !== "function") return "";

        const main = def.gen(part, part.value) || "";
        const sep = part.separator || "";
        const pos = part.position || "prefix";

        return pos === "suffix" ? main + sep : sep + main;
    },
    generateFromParts(parts, partDefinitions) {
        return parts.map((p) => IdGenerator.generatePart(partDefinitions, p)).filter(Boolean).join("");
    },
};

export const hasOrderChanged = (prev, current) => {
    if (prev.length !== current.length) return true;
    return prev.some((item, i) => item.order !== current[i].order);
}

export const generateNBitRandomNumber = (bit) => {
    const bytes = Math.ceil(bit / 8);
    const buffer = new Uint8Array(bytes);
    window.crypto.getRandomValues(buffer);
    let numBigInt = 0n;
    for (let i = 0; i < bytes; i++) {
        numBigInt = (numBigInt << 8n) | BigInt(buffer[i]);
    }
    const mask = (1n << BigInt(bit)) - 1n;
    return numBigInt & mask;
};