import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorResponse {
  status: number;
  message: string;
}

export function createErrorResponse(error: HttpErrorResponse) {
  let message = '';
  if (typeof error.error === 'string') {
    message = error.error;
  } else if (typeof error.error === 'object') {
    message = error.error.message;
  } else {
    message = error.message;
  }
  return {
    status: error.status,
    message: message || 'Erreur technique',
  };
}
