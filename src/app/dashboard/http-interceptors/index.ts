import { Provider } from '@angular/core';

// Injection token for the Http Interceptors multi-provider
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptors';

/** Provider for the Noop Interceptor. */
export const httpInterceptorProviders: Provider =
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true };
