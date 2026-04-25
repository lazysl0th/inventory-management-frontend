import {
    AccessFieldset,
    CustomIdFieldset,
    FieldsFieldset,
    InventoryDetailsFieldset,
} from '../ui/InventoryFormContent'
import { InventoryTabs } from './types'

export const inventoryFormTabs: Record<InventoryTabs, React.FC> = {
    [InventoryTabs.Details]: InventoryDetailsFieldset,
    [InventoryTabs.CustomId]: CustomIdFieldset,
    [InventoryTabs.Fields]: FieldsFieldset,
    [InventoryTabs.Access]: AccessFieldset,
}
