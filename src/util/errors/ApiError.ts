import httpStatusCode from 'http-status-codes';

export interface IApiError {
  code: number;
  message: string;
  codeAsString?: string;
  details?: string;
  doc?: string;
}

export interface ApiErrorResponse extends Omit<IApiError, 'codeAsString'> {
  error: string;
}

class ApiError {
  public static format(error: IApiError): ApiErrorResponse {
    return {
      ...{
        message: error.message,
        code: error.code,
        error: error.codeAsString ?? httpStatusCode.getStatusText(error.code),
      },
      ...(error.doc && { doc: error.doc }),
      ...(error.details && { details: error.details }),
    };
  }
}

export default ApiError;
