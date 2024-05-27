import { AsyncPipe, DatePipe } from '@angular/common';
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
