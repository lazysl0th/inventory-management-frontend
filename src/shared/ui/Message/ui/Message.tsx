import { Alert } from 'react-bootstrap'
import type { IMessage } from '../model/types'
import {
    isBackendError,
    isFetchBaseQueryError,
    isSerializedError,
} from '@/shared/lib/utils'
import { useTranslation } from 'react-i18next'

const Message = ({ error, ...rest }: IMessage) => {
    const { t } = useTranslation('commom')

    let message: string = t('common:errors.unknown')

    if (isFetchBaseQueryError(error)) {
        const errorData = error.data
        if (isBackendError(errorData)) {
            message = errorData.message
        } else {
            message = `Server Error: ${error.status}`
        }
    } else if (isSerializedError(error)) {
        message = error.message || message
    }

    return <Alert {...rest}>{message}</Alert>
}

export default Message
