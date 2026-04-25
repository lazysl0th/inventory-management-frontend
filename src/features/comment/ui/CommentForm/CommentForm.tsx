import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { ICommentForm, TSubmitHandler } from '../../model/types'
import { useCurrentUser } from '@/entities/user/lib/useCurrentUser'
import { FormProvider, Input, SubmitButton } from '@/shared/ui/Form'
import { useCreateInventoryCommentMutation } from '../../api/commentApi'

const CommentForm = () => {
    const { t } = useTranslation('inventory')
    const { inventoryId } = useParams()
    const { currentUser } = useCurrentUser()
    const [createInventoryComment, isSucces] =
        useCreateInventoryCommentMutation()

    const submitHandler: TSubmitHandler = async (values, { resetForm }) => {
        if (inventoryId)
            await createInventoryComment({
                inventoryId,
                content: values.content,
            })
        isSucces && resetForm()
    }

    const formikConfig = {
        initialValues: { content: '' },
        onSubmit: submitHandler,
    }

    return (
        <FormProvider<ICommentForm>
            config={formikConfig}
            className='d-flex flex-column gap-2 p-2 border rounded mt-auto'
        >
            <Input
                name='content'
                as='textarea'
                placeholder={t('placeholders.writeComment')}
                rows={2}
            />
            <SubmitButton
                label={t('buttons.send')}
                className='align-self-end'
                disabled={!inventoryId || !currentUser}
            />
        </FormProvider>
    )
}

export default CommentForm
