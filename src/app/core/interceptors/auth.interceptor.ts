import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const raw = localStorage.getItem('session');

  if (!raw || raw === 'undefined') {
    return next(req);
  }

  let token: string | null = null;

  try {
    const session = JSON.parse(raw);
    token = session?.token ?? null;
  } catch {
    return next(req);
  }

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};