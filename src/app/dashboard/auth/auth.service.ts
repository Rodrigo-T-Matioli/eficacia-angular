import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { tap } from 'rxjs';
import { environment } from '../../environments/environments';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  async login(user: any) {
    console.log('user:', user)
    const result = await this.http.post<any>(`${environment.api}/usuarios/login`, user).toPromise();
    console.log('result:', result)
    if (result && result.access_token) {
      window.localStorage.setItem('token', result.access_token);
      return true;
    }
    return false;
  }

  async createAccount(account: any) {
    const result = await this.http.post<any>(`${environment.api}/usuarios`, account).toPromise();
    return result;
  }

  getAuthorizationToken() {
    const token = window.localStorage.getItem('token');
    return token;
  }

  setToken(token: string) {
    const novoToken = window.localStorage.setItem('token', token);
    return novoToken;
  }

  removeToken() {
    window.localStorage.removeItem('token');
  }

  hasToken() {
    return !!this.getAuthorizationToken();
  }

  isLogged() {
    return this.hasToken();
  }

  refreshToken() {
    const refresh = this.http
        .put<any>(`${environment.api}/token/refresh`, { oldToken: this.getAuthorizationToken() })
        /*
            O pipe executa códigos arbitrários antes do subscribe.
            O operador tap tem acesso à resposta que será encaminhada
            a quem executou o subscribe antes do encaminhamento.
        */
        .pipe(tap((token: any) => this.setToken(token.access_token)));
    return refresh;
  }

  getUser() {
    const token = this.getAuthorizationToken();
    if (token) {
        const payload = jwtDecode(token);
        const user: User = { id: payload.sub };
        return user;
    } else {
      return null
    }
  }
}

