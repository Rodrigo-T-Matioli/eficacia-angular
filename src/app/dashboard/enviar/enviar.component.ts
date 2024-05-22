import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../environments/environments';
import { AuthService } from '../auth/auth.service';
import { CategoriaService } from '../categoria/categoria.service';
import { UsuarioService } from '../usuario/usuario.service';

export interface DialogData {
  clienteId: number,
  clienteRazao: string,
  usuariosEnviados: any,
  fileName: string,
  fileNameValue: string,
  categoria: string,
  mensagem: string,
  ok: string,
  cancel: string,
}

interface Cliente {
  id: number,
  razaoSocial: string,
}

interface UsuarioResponse {
  id: number,
  nome: string,
}

interface Categoria {
  id: number,
  categoria: string,
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
  selector: 'app-enviar',
  standalone: true,
  imports: [
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    DatePipe,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    FormsModule],
  templateUrl: './enviar.component.html',
  styleUrl: './enviar.component.css'
})
export class EnviarComponent {
  fileName: string = '';
  file: any;
  fileNameValue: any = '';
  fileNameBackEnd: string = '';
  usuariosSelecionado: UsuariosSelecionados[] = [];
  usuariosEnviados: object[] = [];
  cliente: Cliente[] = [];
  clienteId: Number | undefined;
  clienteRazao: String | undefined;
  usuarios: Usuario[] = [];
  categorias: any = null;
  categoriasSelecionada: any = undefined;
  mensagem: string = '';
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    public dialog: Dialog) {}

  ngOnInit(): void {
    this.carregarUsuario();
    this.carregarCategoria();
  }

  carregarUsuario(): void {
    const user = this.authService.getUser();
    if (user) {
        this.usuarioService.buscarUsuarios().then(
            (data) => {
                this.usuarios = data;
            },
            err => {
                console.log(err);
            }
        );
    }
  }

  carregarCategoria(): void {
    this.categoriaService.buscarCategorias().then(
      (data) => {
        if (data) {
          this.categorias = data.map((item: any) => {
            const newItem = {
              id: item.id,
              categoria: item.categoria[0].toUpperCase() + item.categoria.substring(1)
            };
            return newItem;
          });
        }
      },
      err => {
          console.log(err);
      }
  );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      this.fileName = this.file.name;
    }
  }

  changeFileNameValue(e: any) {
    this.fileNameValue = e.target.value;
  }

  onFileClick() {
    if (this.usuariosSelecionado.length) {
      if (this.fileNameValue != '') {
        if (this.categoriasSelecionada) {
          if (this.file) {
            for (const usuario of this.usuariosSelecionado) {
              if (usuario && usuario.cliente) {
                  this.cliente.push(usuario.cliente)
              }
            }

            //Pega os clientes selecionados
            let clientes = this.cliente.map((item) => {
              const newItem = {
                id: item.id,
                razaoSocial: item.razaoSocial,
              };
              return newItem;
            });
            //Transforma em array os ids de clientes
            let clienteIds = clientes.map( cliente => `${cliente.id}`);
            //Tira os Ids repetidos
            let setIds = new Set(clienteIds);
            //Transforma o SET em array
            let clienteId = Array.from(setIds);

            let clienteRazoes = clientes.map( cliente => `${cliente.razaoSocial}`);
            let setRazao = new Set(clienteRazoes);
            let clienteRazao = Array.from(setRazao);

            if (clienteId.length && clienteId.length < 2) {
              this.clienteId = Number(clienteId.toString())
              this.clienteRazao = clienteRazao.toString()
              console.log('Id Cliente 2: ', this.clienteId);
              console.log('Razão Social 2: ', this.clienteRazao);
              //Pega os usuarios selecionados
              const usuarios = this.usuariosSelecionado.map((item) => {
                const newItem = {
                  id: item.id,
                  nome: item.nome,
                };
                return newItem;
              });
              const usuariosArray = Object.values(usuarios);
              this.usuariosEnviados = usuariosArray;
              console.log('this.usuariosSelecionado: ', this.usuariosSelecionado);
              console.log('this.usuariosEnviados: ', this.usuariosEnviados);
              this.mensagem = 'correto';
              this.openDialog();
            } else {
              this.mensagem = 'erroClienteUnico';
              this.openDialog();
              this.cliente = [];
              clientes = [];
              clienteIds = [];
              setIds.delete;
              clienteId = [];
              clienteRazoes = [];
              setRazao.delete;
              clienteRazao = [];
            }
          } else {
            this.mensagem = 'erroArquivo';
            this.openDialog();
          }
        } else {
          this.mensagem = 'erroCategoria';
          this.openDialog();
        }
      } else {
        this.mensagem = 'erroNome';
        this.openDialog();
      }
    } else {
      this.mensagem = 'erroClienteUsuario';
      this.openDialog();
    }
  }

  openDialog(): void {
    let categoria: string = ""
    if (this.categoriasSelecionada && this.categoriasSelecionada.categoria) {
      categoria = this.categoriasSelecionada.categoria
    }
    const dialogRef = this.dialog.open<string>(CdkDialogOverviewExampleDialog, {
      width: '510px',
      data: {
        clienteId: this.clienteId,
        clienteRazao: this.clienteRazao,
        usuariosEnviados: this.usuariosEnviados,
        fileName: this.fileName,
        fileNameValue: this.fileNameValue,
        categoria: categoria,
        mensagem: this.mensagem,
        ok: 'ok',
        cancel: 'cancel',
      },
    });

    dialogRef.closed.subscribe(result => {
      if (result === 'ok') {
        const formData = new FormData();
        formData.set('name',this.file.name);
        formData.set('file', this.file);
        console.log('formData: ', formData);
        const upload$ = this.http.post<UploadResponse>(`${environment.api}/uploads`, formData);
        upload$.subscribe((response) => {
          console.log('response: ', response);
          for (const usuario of this.usuariosSelecionado) {
            const dadosArquivo = {
              nome: this.fileNameValue,
              arquivo_completo: response.path,
              cliente: this.clienteId,
              categoria: this.categoriasSelecionada.id,
              usuario: usuario.id
            }
            const dadosArquivo$ = this.http.post(`${environment.api}/arquivos`, dadosArquivo);
            dadosArquivo$.subscribe((response) => {
              console.log('ENTROU', response);
            });
          }
        });
      } else {
        return
      }
    });
  }
}

@Component({
  selector: 'enviar-dialog',
  templateUrl: 'enviar-dialog.html',
  styleUrl: 'enviar-dialog.css',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
})
export class CdkDialogOverviewExampleDialog {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: DialogData,
  ) {}
}
