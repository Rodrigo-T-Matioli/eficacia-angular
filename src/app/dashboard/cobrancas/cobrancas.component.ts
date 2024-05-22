import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ArquivosService } from '../arquivos/arquivos.service';
import { AuthService } from '../auth/auth.service';
import { UsuarioService } from '../usuario/usuario.service';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-cobrancas',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatDividerModule,
    DatePipe,
    MatCardModule,
    MatGridListModule,
    MatButtonModule],
  templateUrl: './cobrancas.component.html',
  styleUrl: './cobrancas.component.css'
})
export class CobrancasComponent {
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
      let documentos: any = [];
      this.arquivosService.buscarArquivos().then(
        (data) => {
          for (let arq of data){
            if (arq.usuario && arq.usuario.id === id && arq.categoria.id === 1){
              documentos.push(arq);
            }
          }
          this.arquivosCobrancas = documentos.reverse();
          console.log('Arquivos Cobrancas: ', this.arquivosCobrancas);
        },
        err => {
            console.log(err);
        }
      );
    }

  folders: Section[] = [
    {
      name: 'Balanço Patrimonial',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Demonstração do Resultado do Exercício (DRE)',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Livro Diário',
      updated: new Date('1/28/16'),
    },
  ];
  notes: Section[] = [
    {
      name: 'Nota Fiscal de Compra',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Guia de Recolhimento do FGTS',
      updated: new Date('1/18/16'),
    },
  ];
}
