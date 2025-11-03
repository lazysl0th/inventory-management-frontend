import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

export const client = createClient({
  authEndpoint: "http://localhost:3001/api/liveblocks-auth",
  // или authEndpoint: "/api/liveblocks-auth" — если у тебя серверная авторизация
});

// что будет храниться в presence (для локов нам этого достаточно)
type Presence = {
  editingInventoryId: number | null;
  userName?: string;
};

// storage пока не используем
type Storage = {};

export const {
  RoomProvider,
  useMyPresence,
  useOthers,
  useRoom,
  useBroadcastEvent,
  useEventListener,
} = createRoomContext<Presence, Storage>(client);
