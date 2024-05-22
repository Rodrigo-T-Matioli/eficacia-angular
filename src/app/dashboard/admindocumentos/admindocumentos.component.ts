import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { ArquivosService } from '../arquivos/arquivos.service';
import { AuthService } from '../auth/auth.service';
import { UsuarioService } from '../usuario/usuario.service';

export interface DialogData {
  idCliente: number,
  mensagem: string,
  ok: string,
  cancel: string,
}

interface Cliente {
  id: number,
  razaoSocial: string,
}

interface Usuario {
  id: number,
  nome: string,
  email: string,
  cliente: Cliente,
}

interface UsuariosSelecionados {
  arquivo: Object,
  cliente: Cliente,
  email: String,
  id: Number,
  nome: String,
}

@Component({
  selector: 'app-admindocumentos',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatDividerModule,
    DatePipe,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './admindocumentos.component.html',
  styleUrl: './admindocumentos.component.css'
})
export class AdmindocumentosComponent {

  arquivos: any;
  arquivosBase: any;
  usuariosSelecionado: UsuariosSelecionados[] = [];
  clientes: Cliente[] = [];
  mensagem: string = '';
  idCliente: Number = 0;
  okMensagem: string = '';

  constructor(
    private arquivosService: ArquivosService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    public dialog: Dialog
  ) { }

  ngOnInit(): void {
    this.carregarUsuario();
    this.cargarArquivos()
  }

  carregarUsuario(): void {
    const user = this.authService.getUser();
    if (user) {
        this.usuarioService.buscarUsuarios().then(
            (data) => {
                for (let arq of data){
                  if (arq.cliente && arq.cliente.razaoSocial){
                    this.clientes.push(arq.cliente);
                  }
                }
                const setCliente = new Set();
                const filterCliente = this.clientes.filter((cliente) => {
                  const duplicatedCliente = setCliente.has(cliente.id);
                  setCliente.add(cliente.id);
                  return !duplicatedCliente;
                });
                this.clientes = filterCliente;
            },
            err => {
                console.log(err);
            }
        );
    }
  }

  cargarArquivos(): void {
    let documentos: any = [];
    this.arquivosService.buscarArquivos().then(
      (data) => {
        for (let arq of data){
          documentos.push(arq);
        }
        this.arquivos = documentos.reverse();
        this.arquivosBase = this.arquivos
        console.log('Arquivos: ', this.arquivos);
      },
      err => {
          console.log(err);
      }
    );
  }

  onFileClick() {
    if (Object.keys(this.usuariosSelecionado).length) {
      this.arquivos = this.arquivosBase.filter((cliente: any) => cliente.cliente.id === Object.values(this.usuariosSelecionado)[0])
    } else {
      this.mensagem = 'erroCliente';
      this.okMensagem = 'okFilter';
      this.openDialog();
    }
  }

  excluirArquivo(id: number) {
    this.idCliente = id;
    this.okMensagem = 'ok';
    this.mensagem = 'excluirArquivo';
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open<string>(CdkDialogOverviewExampleDialog, {
      width: '510px',
      data: {
        idCliente: this.idCliente,
        mensagem: this.mensagem,
        ok: this.okMensagem,
        cancel: 'cancel',
      },
    });

    dialogRef.closed.subscribe(result => {
      if (result === 'ok') {
        console.log('Ok', result);
        location.reload();
      } else if (result === 'okFilter') {
        console.log('okFilter', result);
      } else if (result === 'cancel') {
        const id = Number(this.idCliente);
        this.arquivosService.deletarArquivos(id).then(
          (data) => {
            this.mensagem = 'arquivoExluido';
            this.openDialog();
          },
          err => {
              console.log(err);
          }
        );
      }
    });
  }

}

@Component({
  selector: 'admindocumentos-dialog',
  templateUrl: 'admindocumentos-dialog.html',
  styleUrl: 'admindocumentos-dialog.css',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
})
export class CdkDialogOverviewExampleDialog {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: DialogData,
  ) {}
}
