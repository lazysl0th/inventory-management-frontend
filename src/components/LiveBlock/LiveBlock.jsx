import { RoomProvider } from "../../../liveblocks.config";

export default function LiveBlock({ inventoryId, children }) {
    if (!inventoryId) return children;
    
    return (
        <RoomProvider
            id={`inventory-${inventoryId}`}
            initialPresence={{ editing: null, user: null }}
        >
            {children}
        </RoomProvider>
    );
}