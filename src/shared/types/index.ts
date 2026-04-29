export interface IErrorResponse {
    message: string
    statusCode: number
}

export interface IValidationError extends IErrorResponse {
    validation: {
        body: {
            message: string
        }
    }
}