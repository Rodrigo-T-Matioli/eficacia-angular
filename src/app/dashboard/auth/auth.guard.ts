import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isLogged = this.authService.isLogged();
    let isLogin: any = '';
    if (route.routeConfig) {
      isLogin = (route.routeConfig.path == '' || route.routeConfig.path == 'login')
    }
    if (isLogged && isLogin) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
    // if (this.authService.isUserLoggedIn()) {
    //   return true;
    // } else {
    //   this.router.navigate(['login']);
    //   return false;
    // }
  }
}
