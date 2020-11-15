import { AuthGuard } from './guards/auth.guard';
import { errorInterceptorProvider } from './interceptors/error.interceptor';
import { jwtInterceptorProvider } from './interceptors/jwt.interceptor';

export const authProviders = [
  AuthGuard,
  errorInterceptorProvider,
  jwtInterceptorProvider,
];
