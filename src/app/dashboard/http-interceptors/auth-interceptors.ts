import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor (
    private authService: AuthService,
    private router: Router
  ) {}
  intercept( req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getAuthorizationToken();
    req = req.clone({
        setHeaders: {
            'Authorization': 'Bearer ' + token
        }
    });
    return next.handle(req)
            .pipe(catchError(error => {
                if (
                    error instanceof HttpErrorResponse &&
                    error.status === 401 &&
                    req.url != `http://locahost:3000/login`
                ) {
                    if (!token) {
                        this.router.navigate(['']);
                        return next.handle(req);
                    }

                    if (!this.isRefreshing) {
                        this.isRefreshing = true;
                        this.refreshTokenSubject.next(null);

                        return this.authService
                            .refreshToken()
                            .pipe(switchMap(token => {
                                this.isRefreshing = false;
                                if (token.access_token) {
                                    this.refreshTokenSubject.next(token.access_token);

                                    req = req.clone({
                                        setHeaders: {
                                            'Authorization': 'Bearer ' + token.access_token
                                        }
                                    });

                                    // Retorna a requisição modificada.
                                    return next.handle(req);
                                } else {
                                    this.authService.removeToken();
                                    this.router.navigate(['']);
                                    return next.handle(req);
                                }
                            }));
                    } else {
                        return this.refreshTokenSubject
                            .pipe(
                                filter(token => token != null),
                                take(1),
                                switchMap(token => {
                                    req = req.clone({
                                        setHeaders: {
                                            'Authorization': 'Bearer ' + token
                                        }
                                    });
                                    // Retorna a requisição modificada.
                                    return next.handle(req);
                                })
                            );
                    }
                } else {
                    return throwError(error);
                }
            }));
  }
}
