import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import type { ICommentForm, TSubmitHandler } from '../../model/types'
import { useCurrentUser } from '@/entities/user/lib/useCurrentUser'
import { useCreateInventoryCommentMutation } from '../../api/commentApi'
import { FormProvider } from '@/shared/ui/Form/ui/FormProvider'
import { Input } from '@/shared/ui/Form/ui/Input'
import { SubmitButton } from '@/shared/ui/Form/ui/SubmitButton'

const CommentForm = () => {
    const { t } = useTranslation('common')
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
                placeholder={t('common:placeholders.writeComment')}
                rows={2}
            />
            <SubmitButton
                label={t('common:actions.send')}
                className='align-self-end'
                disabled={!inventoryId || !currentUser}
            />
        </FormProvider>
    )
}

export default CommentForm
