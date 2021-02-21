import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorResponse {
  status: number;
  message: string;
}

export function createErrorResponse(error: HttpErrorResponse) {
  let message = '';
  if (typeof error.error === 'string') {
    // FIXME: fix case when error is stringified json (case of wrong login for example)
    message = error.error;
  } else if (typeof error.error === 'object') {
    message = error.error.message;
  }
  return {
    status: error.status,
    message: message || 'Erreur technique',
  };
}
