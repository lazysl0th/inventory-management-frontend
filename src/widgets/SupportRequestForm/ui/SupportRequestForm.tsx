import { useDispatch } from 'react-redux'
import { useMatch } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/query'
import { showToast } from '@/shared/model/ui'
import { useSendSupportRequestMutation } from '@/features/integration'
import { ISupportRequestForm } from '../model/types'
import { supportRequestShema } from '../model/validation'
import { useCurrentUser } from '@/entities/user'
import { useGetInventoryQuery } from '@/entities/inventory'
import {
    FloatingInput,
    FloatingSelect,
    FormProvider,
    SubmitButton,
} from '@/shared/ui/Form'

const SupportRequestForm = () => {
    const match = useMatch('/inventories/:inventoryId')
    const inventoryId = match?.params.inventoryId
    const dispatch = useDispatch()
    //const { t: tv } = useTranslation('validation');
    const { currentUser } = useCurrentUser()

    const [sendSupportRequest] = useSendSupportRequestMutation()

    const submitHandler = async (values: ISupportRequestForm) => {
        try {
            await sendSupportRequest(values).unwrap()
            dispatch(
                showToast({message: 'Your support request has been successfully sent'})
            )
        } catch (e) {
            dispatch(
                showToast(
                    {message: 'There were errors while submitting your support request.'}
                )
            )
            console.log(e)
        }
    }

    const {
        data: inventory,
        isLoading: inventoryIsLoading,
        error: inventoryError,
        isSuccess: inventoryIsSuccess,
    } = useGetInventoryQuery(
        inventoryId && inventoryId !== 'new' ? { inventoryId } : skipToken
    )

    const initialValues = {
        userName: currentUser?.name || '',
        userEmail: currentUser?.email || '',
        inventory: inventory?.title || '',
        link: window.location.href,
        priority: '',
        request: '',
    }

    const formikConfig = {
        initialValues,
        validationSchema: supportRequestShema,
        onSubmit: submitHandler,
    }

    return (
        <FormProvider
            config={formikConfig}
            className='d-flex flex-column gap-2'
            id='supportRequest'
        >
            <FloatingInput
                name='userName'
                label='Name'
                type='text'
                placeholder='Name'
            />
            <FloatingInput
                name='userEmail'
                label='Email'
                type='email'
                placeholder='name@example.com'
            />
            <FloatingInput
                name='inventory'
                label='Title inventory'
                type='text'
                placeholder='Title Inventory'
            />
            <FloatingInput
                name='link'
                label='Link'
                type='text'
                placeholder='Link'
            />

            <FloatingSelect name='priority' label='Priority'>
                <option value='' disabled>
                    {' '}
                    {'Select priority...'}
                </option>
                <option value='high'>High</option>
                <option value='average'>Average</option>
                <option value='low'>Low</option>
            </FloatingSelect>

            <FloatingInput
                name='request'
                label='Request'
                as='textarea'
                placeholder='Request'
            />
            <SubmitButton
                form='supportRequest'
                containerId='infoTooltip--footer'
                label='Send request'
            />
        </FormProvider>
    )
}

export default SupportRequestForm
