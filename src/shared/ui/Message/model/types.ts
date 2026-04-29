import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { AlertProps } from 'react-bootstrap'

export interface IMessage extends AlertProps {
    error?: SerializedError | FetchBaseQueryError | undefined
}
