import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  buscarCategorias() {
    const result = this.http.get<any>(`${environment.api}/categorias/`).toPromise();
    return result;
  }
}

