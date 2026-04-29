import { lazy } from 'react'

export const AccessFieldset = lazy(
    () => import('./ui/AccessFieldset/AccessFieldset')
)
export const CustomIdFieldset = lazy(
    () => import('./ui/CustomIdFieldset/CustomIdFieldset')
)
export const FieldsFieldset = lazy(
    () => import('./ui/FieldsFieldset/FieldsFieldset')
)
export const InventoryDetailsFieldset = lazy(
    () => import('./ui/InventoryDetailsFieldset/InventoryDetailsFieldset')
)
