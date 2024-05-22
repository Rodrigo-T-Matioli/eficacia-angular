import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ArquivosService {

  constructor(private http: HttpClient) { }

  buscarArquivos() {
    const result = this.http.get<any>(`${environment.api}/arquivos`).toPromise();
    return result;
  }

  deletarArquivos(id: number) {
    const result = this.http.delete<number>(`${environment.api}/arquivos/${id}`).toPromise();
    return result;
  }
}

