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

export interface Section {
  name: string;
  updated: Date;
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
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
  ],
})

export class DashboardComponent implements OnInit {
  // private breakpointObserver = inject(BreakpointObserver);
  arquivosDocumentos: any;
  arquivosCobrancas: any;
  usuarioId: any;
  usuario = {
    nome: '',
    email: '',
    endereco: '',
    telefone: ''
  }

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private arquivosService: ArquivosService,
    ) { }

  ngOnInit(): void {
    this.cargarUsuario()
  }

  cargarUsuario(): void {
    const user = this.authService.getUser();
    if (user) {
        this.usuarioService.buscarUsuario(user.id).then(
            (data) => {
                this.usuario = data;
                this.usuarioId = data.id;
                this.cargarArquivos(this.usuarioId)
            },
            err => {
                console.log(err);
            }
        );
    }
  }

  cargarArquivos(id: number): void {
    let documentos: any = [{
      nome: '',
      arquivo_completo: '',
      createdAt: Date
    }];
    let cobrancas: any = [{
      nome: '',
      arquivo_completo: '',
      createdAt: Date
    }];
    this.arquivosService.buscarArquivos().then(
      (data) => {
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
        console.log()
      },
      err => {
          console.log(err);
      }
    );
  }

  // getClientes(): void {
  //   this.clientesService.getAll().subscribe((clientes) => (this.clientes = clientes))
  // }

  /** Based on the screen size, switch from standard to one column per row */
  // documentos = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
  //   map(({ matches }) => {
  //     if (matches) {
  //       return [
  //         { title: 'Documentos', subtitulo: 'Últimos documentos', cols: 1, rows: 1 },
  //         { title: 'Cobranças empresariais', subtitulo: 'Últimas cobranças', cols: 1, rows: 1 }
  //       ];
  //     }

  //     return [
  //       { title: 'Documentos', subtitulo: 'Últimos documentos', cols: 1, rows: 1 },
  //       { title: 'Cobranças empresariais', subtitulo: 'Últimas cobranças', cols: 1, rows: 1 }
  //     ];
  //   })
  // );

  // perfil = {
  //   nome: 'Rodrigo Tammaro Matioli',
  //   email: 'digotammaro@gmail.com',
  //   endereco: 'Rua José de Oliveira, 270',
  //   telefone: '11969203819'
  // };

  // folders: Section[] = [
  //   {
  //     name: 'Balanço Patrimonial',
  //     updated: new Date('1/1/16'),
  //   },
  //   {
  //     name: 'Demonstração do Resultado do Exercício (DRE)',
  //     updated: new Date('1/17/16'),
  //   }
  // ];

  // notes: Section[] = [
  //   {
  //     name: 'Nota Fiscal de Compra',
  //     updated: new Date('2/20/16'),
  //   },
  //   {
  //     name: 'Guia de Recolhimento do FGTS',
  //     updated: new Date('1/18/16'),
  //   },
  // ];

  // console(){
  //   console.log('show')
  // }
}
