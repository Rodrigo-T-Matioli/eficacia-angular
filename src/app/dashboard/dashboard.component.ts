import { AsyncPipe, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { environment } from '../environments/environments';
import { ArquivosService } from './arquivos/arquivos.service';
import { AuthService } from './auth/auth.service';
import { UsuarioService } from './usuario/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})

export class DashboardComponent implements OnInit {
  arquivosDocumentos: any = undefined;
  arquivosCobrancas: any;
  usuarioId: any = undefined;
  usuario = {
    nome: undefined,
    email: undefined,
    endereco: undefined,
    telefone: undefined
  }
  recarregar: boolean = false;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private arquivosService: ArquivosService,
    private http: HttpClient,
    ) { }

  async ngOnInit() {
    await this.carregarUsuario();
    if (window.localStorage) {
      if (!localStorage.getItem('reload')) {
          localStorage['reload'] = true;
          window.location.reload();
      } else {
          localStorage.removeItem('reload');
      }
    }
  }

  async getArquivo(fullPath: string) {
    console.log('fullPath: ', fullPath);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/octet-binary;charset=utf-8'
    });

    // const getArquivo$ = this.http.get(`${environment.api}/uploads/supa/base?fullPath=${fullPath}`, { responseType: 'arraybuffer' });
    //   getArquivo$.subscribe((response: ArrayBuffer) => {
    //     const buffer = new ArrayBuffer(response.byteLength);
    //     console.log('response: ', response);
    //     console.log('buffer: ', buffer);
    //   });

    // const getArquivo$ = this.http.get(`${environment.api}/uploads/supa/base?fullPath=${fullPath}`, { responseType: 'blob' });
    //   getArquivo$.subscribe((response: Blob) => {
    //     var blob = new Blob([response], {type: 'text/plain;charset=utf-8'});
    //     var objectUrl = URL.createObjectURL(blob);
    //     window.open(objectUrl);
    //     const aElement = document.createElement("a");
    //     aElement.setAttribute("download", fullPath);
    //     const href = URL.createObjectURL(response);
    //     aElement.href = href;
    //     aElement.setAttribute("target", "_blank");
    //     aElement.click();
    //     URL.revokeObjectURL(href);
    //   });

    this.http.get(`${environment.api}/uploads/supa/base?fullPath=${fullPath}`, { responseType: 'text' }).subscribe(async blob => {
      // const blob2 = new Blob([blob], {
      //   type: 'application/pdf',
      // });
      window.open(blob, '_blank');
      // console.log('blob2: ', blob);
      // const aElement = document.createElement("a");
      // aElement.setAttribute("download", blob);
      // aElement.href = blob;
      // aElement.setAttribute("target", "_blank");
      // aElement.click();
      // URL.revokeObjectURL(blob);
      // this.saveFile(blob);
    });

    // const getArquivo$ = this.http.get(`${environment.api}/uploads/supa/base?fullPath=${fullPath}`, { headers: headers, responseType: 'text' });

    // getArquivo$.subscribe((response: string) => {
    //   console.log(response)
    //   const a = document.createElement('a');
    //   a.href = response;
    //   a.download = response; // Especifique o nome do arquivo desejado
    //   document.body.appendChild(a);
    //   document.body.removeChild(a);
    //   window.URL.revokeObjectURL(response);
    //   // const aElement = document.createElement("a");
    //   // aElement.setAttribute("download", fullPath);
    //   // aElement.href = response;
    //   // aElement.setAttribute("target", "_blank");
    //   // aElement.click();
    //   // URL.revokeObjectURL(response);
    //   // this.saveFile(response);
    // });
  }

  saveFile(data: string) {
    window.open(data, '_blank');
  }

  async carregarUsuario() {
    await this.authService.getUser().then(
      (data: any) => {
        if (data) {
          this.usuarioId = data.id;
          this.buscarUsuario(data);
        }
      },
      err => {
          console.log(err);
      }
    );
  }

  async buscarUsuario( data: any ) {
    await this.usuarioService.buscarUsuario(data.id).then(
      (data) => {
          if (data)
            this.usuario = data;
            this.cargarArquivos(this.usuarioId);
      },
      err => {
          console.log(err);
      }
  );
  }

  async cargarArquivos(id: number) {
    let documentos: any[] = [];
    let cobrancas: any[] = [];
    await this.arquivosService.buscarArquivos().then(
      (data) => {
        if (data) {
          if (data)
            for (let arq of data){
              if (arq.usuario && arq.usuario.id === id && arq.categoria.id === 2){
                documentos.push(arq);
              }
              if (arq.usuario && arq.usuario.id === id && arq.categoria.id === 1){
                cobrancas.push(arq);
              }
            }
            this.arquivosDocumentos = documentos.slice(-2).reverse();
            this.arquivosCobrancas = cobrancas.slice(-2).reverse();
        }
      },
      err => {
          console.log(err);
      }
    );
  }
}
