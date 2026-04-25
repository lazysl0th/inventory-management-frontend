import { useDispatch } from 'react-redux'
import InventoryFormContent from './InventoryFormContent/ui/InventoryFormContent'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Alert, Spinner } from 'react-bootstrap'
import { Typename } from '@/shared/ui/DataTable'
import { inventorySchema } from '../model/validation'
import useRecordHandlers from '@/shared/lib/hooks/useRecordHandlers'
import { isFetchBaseQueryError } from '@/shared/lib/utils'
import { AppModals, openModal } from '@/shared/model/ui'
import {
    Category,
    IInventoryForm,
    IUpdateInventoryData,
    setActiveInventory,
    TCreateInventoryData,
    useCreateInventoryMutation,
    useInventoryAccess,
    useInventoryData,
    useUpdateInventoryMutation,
} from '@/entities/inventory'
import { FormProvider, SubmitButton } from '@/shared/ui/Form'
import { useCurrentUser } from '@/entities/user'

const initialValuesTemplate: Omit<
    IInventoryForm,
    'owner' | 'createdAt' | 'updatedAt'
> = {
    title: '',
    category: Category.None,
    description: '',
    image: '',
    tags: [],
    customIdFormat: {
        parts: [],
        summary: '',
    },
    fields: [],
    isPublic: false,
    token: '',
    allowedUsers: [],
    version: 0,
}

const InventoryForm: React.FC = () => {
    const { currentUser } = useCurrentUser()
    const location = useLocation()
    const { t } = useTranslation('inventory')
    const dispatch = useDispatch()

    const {
        data: inventory,
        isLoading: inventoryIsLoading,
        error: inventoryError,
        isSuccess: inventoryIsSuccess,
        inventoryId,
    } = useInventoryData()

    const [createInventory] = useCreateInventoryMutation()
    const [updateInventory] = useUpdateInventoryMutation()
    const { openRecord } = useRecordHandlers(Typename.Inventory)

    const modalView = location.state?.modal

    const initialInventory: IInventoryForm = {
        ...initialValuesTemplate,
        owner: currentUser?.name ?? '',
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
    }

    const update = async (inventoryData: IUpdateInventoryData) => {
        const updateInventoryData = {
            ...inventoryData,
            fields: inventoryData.fields.map(({ id, isNew, ...field }) =>
                isNew ? field : { ...field, id }
            ),
        }
        try {
            await updateInventory(updateInventoryData).unwrap()
        } catch (e) {
            if (isFetchBaseQueryError(e) && e.status === 409) {
                dispatch(
                    openModal({
                        name: AppModals.VersionConflict,
                        payload: updateInventoryData,
                    })
                )
            }
            console.log(e)
        }
    }

    const create = async (inventoryData: TCreateInventoryData) => {
        try {
            const inventory = await createInventory(inventoryData).unwrap()
            dispatch(setActiveInventory({ id: inventory.id }))
            openRecord(inventory.id, true)
        } catch (e) {
            console.log(e)
        }
    }

    const submitHandler = async (values: IInventoryForm) => {
        const { createdAt, updatedAt, token, owner, ...inventoryData } = values
        if (inventoryData.id) {
            update(inventoryData)
        } else {
            create(inventoryData)
        }
    }

    const formikConfig = {
        initialValues: inventory
            ? {
                  ...inventory,
                  fields: inventory.fields.toSorted(
                      (a, b) => a.order - b.order
                  ),
                  createdAt: new Date(inventory.createdAt).toLocaleString(),
                  updatedAt: new Date(inventory.updatedAt).toLocaleString(),
                  owner: inventory.owner?.name ?? '',
              }
            : initialInventory,
        validationSchema: inventorySchema,
        onSubmit: submitHandler,
        enableReinitialize: inventory ? true : false,
    }

    const { isAdmin, isOwner } = useInventoryAccess(inventory)

    return (
        <FormProvider<IInventoryForm> config={formikConfig} id='inventory'>
            {inventoryIsLoading ? (
                <div className='d-flex justify-content-center align-items-center'>
                    <Spinner animation='border' className='align-self-center' />
                </div>
            ) : inventoryError ? (
                <div className='d-flex justify-content-center align-items-center'>
                    <Alert variant='danger'>{'error.message'}</Alert>
                </div>
            ) : (
                <>
                    <fieldset disabled={!!inventoryId && !isAdmin && !isOwner}>
                        <InventoryFormContent />
                    </fieldset>
                    <SubmitButton
                        disabled={!isAdmin && !isOwner}
                        containerId={
                            modalView
                                ? 'inventory-modal--footer'
                                : 'inventory--submit-button'
                        }
                        label={
                            inventory?.id
                                ? t('buttons.update')
                                : t('buttons.create')
                        }
                        form='inventory'
                    />
                </>
            )}
        </FormProvider>
    )
}

export default InventoryForm
