import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { AppRoutePathes } from '../enums/ERoutes';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
              private loginService: LoginService,
              private router: Router,
              private toastrService: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const modifiedRequest = request.clone({
      setHeaders: {
        'Authorization': `token ${this.loginService.getToken()}`
      }
    });

    return next.handle(modifiedRequest).pipe(
      catchError((error) => {
        if(error.status === 401) {
          this.router.navigate([AppRoutePathes.AUTH]);
          this.toastrService.error('Error', error.error.message);
          return throwError(() => new Error(error));
        }
        else {
          this.toastrService.error('Error', error.error.message);
          return throwError(() => new Error(error));
        }
      })
    );
  }
}
