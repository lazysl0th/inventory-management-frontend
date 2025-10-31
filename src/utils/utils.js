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
  /**
   * 🔹 Генерация отдельной части идентификатора
   * Используется и в preview, и при сборке полного примера summary
   */
  generatePart(partDefinitions, part) {
    if (!part) return "";

    const def = partDefinitions?.[part?.type];
    if (!def || typeof def.gen !== "function") return "";

    const main = def.gen(part) || "";
    const val = part.value || "";
    const pos = part.position || "prefix";

    // TEXT возвращает только собственное значение
    if (part.type === "TEXT") return val;

    // Остальные — склейка в зависимости от позиции
    return pos === "suffix" ? main + val : val + main;
  },

  /**
   * 🔹 Генерация образца (summary) без инкремента, для сохранения в БД
   * Используется при изменении частей CustomIdForm
   */
  generateFromParts(parts = [], partDefinitions) {
    return parts
      .map((p) => IdGenerator.generatePart(partDefinitions, p))
      .filter(Boolean)
      .join("");
  },
};



export const hasOrderChanged = (prev, current) => {
    if (prev.length !== current.length) return true;
    return prev.some((item, i) => item.order !== current[i].order);
}