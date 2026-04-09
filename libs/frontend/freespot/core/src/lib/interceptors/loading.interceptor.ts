import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../loading/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  return inject(LoadingService).showLoaderUntilCompleted(next(req));
};
