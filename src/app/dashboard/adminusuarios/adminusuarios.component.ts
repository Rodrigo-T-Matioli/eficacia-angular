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

  carregarUsuario(): void {
    const user = this.authService.getUser();
    if (user) {
        this.usuarioService.buscarUsuarios().then(
            (data) => {
              console.log('DATA: ', data)
              this.usuariosPrincipal = data;
                for (let arq of data){
                  if (arq.cliente && arq.cliente.razaoSocial){
                    // this.clientes.push(arq.cliente);
                  } else {
                    this.usuarios.push({id: arq.id, nome: arq.nome, email: arq.email, status: arq.status})
                  }
                }
                // const setCliente = new Set();
                // const filterCliente = this.clientes.filter((cliente) => {
                //   const duplicatedCliente = setCliente.has(cliente.id);
                //   setCliente.add(cliente.id);
                //   return !duplicatedCliente;
                // });
                // this.clientes = filterCliente;
                // console.log('Usuários: ', this.usuarios);
            },
            err => {
                console.log(err);
            }
        );
    }
  }

  changeClienteValue() {
    this.usuarioDesassociar = Object.values(this.clientesSelecionadoDesassociar);
    // this.usuarioDesassociar = this.clientesSelecionadoDesassociar;
    console.log('changeClienteValue: ', this.usuarioDesassociar[0])
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
          console.log('ENTROU', response);
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
        console.log('Ok', result);
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
