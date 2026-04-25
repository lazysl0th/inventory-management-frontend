import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useGetInventoryQuery } from '../api/inventoryApi'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'
import {
    resetActiveInventory,
    setActiveInventory,
} from '../model/inventorySlice'

export const useInventoryData = () => {
    const { inventoryId } = useParams()
    const dispatch = useDispatch()

    const result = useGetInventoryQuery(
        inventoryId && inventoryId !== 'new' ? { inventoryId } : skipToken
    )

    useEffect(() => {
        if (inventoryId && inventoryId !== 'new') {
            dispatch(setActiveInventory({ id: Number(inventoryId) }))
        }
        return () => {
            dispatch(resetActiveInventory())
        }
    }, [inventoryId, dispatch])

    return { ...result, inventoryId }
}
