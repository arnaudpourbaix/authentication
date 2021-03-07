import { InjectionToken } from '@angular/core';

export interface AuthModuleConfig {
  serverUrl: string;
}

export const AUTH_CONFIG = new InjectionToken<AuthModuleConfig>('AUTH_CONFIG');
