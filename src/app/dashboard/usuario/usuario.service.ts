import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  buscarUsuarios() {
    const result = this.http.get<any>(`${environment.api}/usuarios/`).toPromise();
    return result;
  }

  buscarUsuario(idUser: any) {
    const result = this.http.get<any>(`${environment.api}/usuarios/${idUser}`).toPromise();
    return result;
  }

  alterarUsuarios(idUser: any, dados: any) {
    const result = this.http.patch<any>(`${environment.api}/usuarios/${idUser}`, dados).toPromise();
    return result;
  }
}

