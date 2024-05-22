import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ArquivosService } from '../arquivos/arquivos.service';
import { AuthService } from '../auth/auth.service';
import { UsuarioService } from '../usuario/usuario.service';

export interface Section {
  name: string;
  descricao: string;
  updated: Date;
}

@Component({
  selector: 'app-dados-recebidos',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatDividerModule,
    DatePipe,
    MatCardModule,
    MatButtonModule],
  templateUrl: './dados-recebidos.component.html',
  styleUrl: './dados-recebidos.component.css'
})
export class DadosRecebidosComponent {

  arquivosDocumentos: any;
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
      let documentos: any = [];
      this.arquivosService.buscarArquivos().then(
        (data) => {
          for (let arq of data){
            if (arq.usuario && arq.usuario.id === id && arq.categoria.id === 2){
              documentos.push(arq);
            }
          }
          this.arquivosDocumentos = documentos.reverse();
          console.log('Arquivos Cobrancas: ', this.arquivosDocumentos);
        },
        err => {
            console.log(err);
        }
      );
    }

  folders: Section[] = [
    {
      name: 'Balanço Patrimonial',
      descricao: 'Balanço - 2021 à 2022',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Demonstração do Resultado do Exercício (DRE)',
      descricao: 'Demonstração - Julho 2022',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Livro Diário',
      descricao: 'Livro - Julho 2022',
      updated: new Date('1/28/16'),
    },
  ];
  notes: Section[] = [
    {
      name: 'Nota Fiscal de Compra',
      descricao: 'Nota - Número 0456867',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Guia de Recolhimento do FGTS',
      descricao: 'Guia - Ano 2022',
      updated: new Date('1/18/16'),
    },
  ];
}
