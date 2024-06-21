import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { environment } from '../../environments/environments';
import { AuthService } from '../auth/auth.service';
import { ClientesService } from '../clientes/clientes.service';
import { UsuarioService } from '../usuario/usuario.service';

export interface DialogData {
  mensagem: string,
  ok: string,
  cancel: string,
}

interface Cliente {
  id: number,
  razaoSocial: string,
}

interface UsuariosSelecionados {
  arquivo: Object,
  cliente: Cliente,
  email: String,
  id: Number,
  nome: String,
  razaoSocial: string,
}

interface Usuarios {
  email: String,
  id: Number,
  nome: String,
  status: String,
  cliente: Cliente
}

@Component({
  selector: 'app-adminusuarios',
  standalone: true,
  imports: [
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatTabsModule,
    MatDividerModule
  ],
  templateUrl: './adminusuarios.component.html',
  styleUrl: './adminusuarios.component.css'
})
export class AdminusuariosComponent {
  clientesSelecionado: UsuariosSelecionados[] = [];
  clientesSelecionadoDesassociar: UsuariosSelecionados[] = [];
  usuarioDesassociar: UsuariosSelecionados[] = [];
  usuarioId: any;
  usuarios: Usuarios[] = [];
  usuariosPrincipal: Usuarios[] = [];
  usuariosSelecionado: Usuarios[] = [];
  clientes: Cliente[] = [];
  mensagem: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private clientesService: ClientesService,
    private authService: AuthService,
    private http: HttpClient,
    public dialog: Dialog
  ) { }

  ngOnInit(): void {
    this.usuarioId = this.authService.getUser();
    this.carregarUsuario();
    this.carregarCliente();
  }

  carregarCliente(): void {
    this.clientesService.buscarClientes().then(
      (data:any) => {
        this.clientes = data
      },
      err => {
          console.log(err);
      }
    )
  }

  async carregarUsuario() {
    await this.authService.getUser().then(
      (data: any) => {
        if (data) {
          this.usuarioId = data.id;
          this.buscarUsuario();
        }
      },
      err => {
          console.log(err);
      }
    );
  }

  buscarUsuario(): void {
    this.usuarioService.buscarUsuarios().then(
      (data) => {
        console.log('Usuarios Principal: ', data)
        this.usuariosPrincipal = data;
          for (let arq of data){
            if (arq.cliente && arq.cliente.razaoSocial){
              // this.clientes.push(arq.cliente);
            } else {
              if (arq.status === 'A' && !arq.cliente) {
                this.usuarios.push({id: arq.id, nome: arq.nome, email: arq.email, status: arq.status, cliente: {id: 0, razaoSocial: ''}})
              }
            }
          }
      },
      err => {
          console.log(err);
      }
    );
  }

  changeClienteValue() {
    this.usuarioDesassociar = Object.values(this.clientesSelecionadoDesassociar);
    // this.usuarioDesassociar = this.clientesSelecionadoDesassociar;
    console.log('changeClienteValue: ', this.usuarioDesassociar[0])
    let clienteSelecionado: any = this.usuarioDesassociar[0];
    let usuarioSelecionado: any = [];
    for (let arq of this.usuariosPrincipal){
      if (arq && arq.cliente && parseInt(clienteSelecionado) === arq.cliente.id) {
        usuarioSelecionado.push(arq);
      }
    }
    this.usuarioDesassociar = usuarioSelecionado;
    // let usuariosCliente = this.usuariosPrincipal.map((item: any) => {
    //   if (item && item.cliente && this.usuarioDesassociar[0] === item.cliente.id) {
    //     const newItem = {
    //       id: item.id,
    //       nome: item.nome
    //     };
    //     return newItem;
    //   } else {
    //     return;
    //   }
    // });
    console.log('DATA: ', this.usuariosPrincipal)
    console.log('Filtrado: ', usuarioSelecionado)
  }

  onAssocCliente(): void {
    console.log('Cliente: ', this.clientesSelecionadoDesassociar)
    if (Object.values(this.clientesSelecionado)[0]) {
      if (Object.values(this.usuariosSelecionado)[0]) {
        const cliente = {
          cliente: Object.values(this.clientesSelecionado)[0]
        }
        const dadosCliente$ = this.http.patch(`${environment.api}/usuarios/${Object.values(this.usuariosSelecionado)[0]}`, cliente);
        dadosCliente$.subscribe((response) => {
          if (response) {
            this.mensagem = 'associado';
            this.openDialog();
          }
        });
      } else {
        this.mensagem = 'faltaUsuario';
        this.openDialog();
      }
    } else {
      this.mensagem = 'faltaCliente';
      this.openDialog();
    }

  }

  openDialog(): void {
    const dialogRef = this.dialog.open<string>(CdkDialogOverviewExampleDialog, {
      width: '510px',
      data: {
        mensagem: this.mensagem,
        ok: 'ok',
        cancel: 'cancel',
      },
    });

    dialogRef.closed.subscribe(result => {
      if (result === 'ok') {
        window.location.reload();
      } else {
        return;
      }
    });
  }

  desativarUsuario(event: any) {
    const dados = {
      status: 'I'
    };
    this.usuarioService.alterarUsuarios(event, dados).then(
      (data) => {
        this.usuariosPrincipal = [];
        this.carregarUsuario();
        window.location.reload();
      },
      err => {
          console.log(err);
      }
    );
  }

  ativarUsuario(event: any) {
    const dados = {
      status: 'A'
    };
    this.usuarioService.alterarUsuarios(event, dados).then(
      (data) => {
        this.usuariosPrincipal = [];
        this.carregarUsuario();
        window.location.reload();
      },
      err => {
          console.log(err);
      }
    );
  }

}

@Component({
  selector: 'adminusuarios-dialog',
  templateUrl: 'adminusuarios-dialog.html',
  styleUrl: 'adminusuarios-dialog.css',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
})
export class CdkDialogOverviewExampleDialog {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: DialogData,
  ) {}
}
