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

interface UploadResponse {
  destination: string;
  encoding: string;
  fieldname: string;
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
}

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
  // private breakpointObserver = inject(BreakpointObserver);
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
    // this.recarregarPagina();
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
      'Accept': 'application/octet-stream'
    });
    const getArquivo$ = this.http.get(`${environment.api}/uploads/supa/base?fullPath=${fullPath}`, { headers: headers, responseType: 'text' });

    getArquivo$.subscribe((response: any) => {
      this.saveFile(response);
    });
    // getArquivo$.subscribe(async (response) => {
    //   const text = await response;
    //   console.log('text: ', text);
    //   const fileURL = URL.createObjectURL(text);
    //   console.log('fileURL: ', fileURL);
    //   const link = document.createElement('a');
    //   console.log('link: ', link);
    //   link.href = fileURL;
    //   console.log('link.href: ', link.href);
    //   link.download = fullPath;
    //   console.log('link.download: ', link.download);
    //   link.click();
    //   const fileURL = URL.createObjectURL(text);
    //   const link = document.createElement('a');
    //   link.href = fileURL;
    //   link.download = fullPath;
    //   link.click();
    // });
  }

  saveFile(data: string) {
    window.open(data, '_blank');
  }

  // async getArquivo(fullPath: string) {
  //   console.log('fullPath: ', fullPath);
  //   const getArquivo$ = this.http.get<UploadResponse>(`${environment.api}/uploads/supa/base?fullPath=${fullPath}`);
  //     getArquivo$.subscribe((response) => {
  //       console.log('dadosArquivo: ', response)
  //     });
  // }

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
          this.usuario = data;
          this.cargarArquivos(this.usuarioId)
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
          for (let arq of data){
            if (arq.usuario && arq.usuario.id === id && arq.categoria.id === 2){
              documentos.push(arq);
            }
            if (arq.usuario && arq.usuario.id === id && arq.categoria.id === 1){
              cobrancas.push(arq);
            }
          }
          this.arquivosDocumentos = documentos.slice(-2).reverse();
          console.log('arquivosDocumentos: ', this.arquivosDocumentos)
          this.arquivosCobrancas = cobrancas.slice(-2).reverse();
          console.log('arquivosCobrancas: ', this.arquivosCobrancas)
        }
      },
      err => {
          console.log(err);
      }
    );
  }
}
