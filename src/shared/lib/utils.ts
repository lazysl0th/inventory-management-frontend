import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { IErrorResponse, IValidationError } from '../types';

export function isObject(obj: unknown): obj is object {
    return typeof obj === 'object' && obj != null
}

export function isFetchBaseQueryError(
    error: unknown
): error is FetchBaseQueryError {
    return isObject(error) && 'status' in error && 'data' in error
}

export function isBackendError(
    data: unknown
): data is IErrorResponse {
    return (
        isObject(data) && 'statusCode' in data && 'message' in data
    );
}

export function isValidationError(
    data: unknown
): data is IValidationError {
    return (
        isBackendError(data) && 'validation' in data
    );
}

export function isSerializedError(
    error: unknown
): error is SerializedError {
    return isObject(error) && 'message' in error && !('status' in error);
}

