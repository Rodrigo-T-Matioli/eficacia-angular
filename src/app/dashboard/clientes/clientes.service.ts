import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Clientes } from './dto/clientes-dto';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  productoURL = `${environment.api}/clientes`;

  constructor(private http: HttpClient) { }

  buscarClientes() {
    const result = this.http.get<Clientes[]>(`${environment.api}/clientes`).toPromise();
    return result;
  }

  public detail(id: number): Observable<Clientes> {
    return this.http.get<Clientes>(`${this.productoURL}${id}`);
  }

  public detailName(nombre: string): Observable<Clientes> {
    return this.http.get<Clientes>(`${this.productoURL}${nombre}`);
  }

  public save(cliente: Clientes): Observable<any> {
    return this.http.post<any>(this.productoURL, cliente);
  }

  public update(id: number, cliente: Clientes): Observable<any> {
    return this.http.put<any>(`${this.productoURL}${id}`, cliente);
  }

  public delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.productoURL}${id}`);
  }
}
