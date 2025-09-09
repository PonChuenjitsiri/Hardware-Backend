export interface SuccessResponse<T> {
    status: 'success';
    message?: string;
    data: T;
    [key: string]: any;
}

export interface ErrorResponse {
    status: 'error';
    message: string;
    errorCode?: string;
}

export const successResponse = <T>(data: T, message: string = 'Success', extra: Record<string, any> = {}): SuccessResponse<T> => {
    return {
        status: 'success',
        message,
        data,
        ...extra, // Spread additional properties at the top level
    };
};

export const errorResponse = (message: string, errorCode?: string): ErrorResponse => {
    return {
        status: 'error',
        message,
        errorCode,
    };
};


