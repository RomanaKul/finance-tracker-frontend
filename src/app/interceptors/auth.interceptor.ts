import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const storedUser = localStorage.getItem('currentUser');
  let token: string | null = null;

  try {
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    token = currentUser?.accessToken;
  } catch (e) {
    console.error('Error parsing token from localStorage', e);
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
