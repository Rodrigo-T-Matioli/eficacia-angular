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
import { ClientesService } from '../clientes/clientes.service';
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
  clienteSelecionado: UsuariosSelecionados[] = [];
  usuariosEnviados: object[] = [];
  clientes: Cliente[] = [];
  cliente: Cliente[] = [];
  clienteId: Number | undefined;
  clienteRazao: String | undefined;
  usuarios: any[] = [];
  categorias: any = null;
  categoriasSelecionada: any = undefined;
  mensagem: string = '';
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    private clientesService: ClientesService,
    public dialog: Dialog) {}

  ngOnInit(): void {
    this.buscarClientes();
    this.carregarCategoria();
  }

  buscarClientes() {
    this.clientesService.buscarClientes().then(
      (data: any) => {
        if (data) {
          this.clientes = data.map((item: any) => {
            const newItem = {
              id: item.id,
              razaoSocial: item.razaoSocial
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
    if (this.clienteSelecionado.hasOwnProperty('id')) {
      if (this.fileNameValue != '') {
        if (this.categoriasSelecionada) {

          if (this.file) {
            let clienteRazoes =  Object.values(this.clienteSelecionado)[1];
            let clienteId = Object.values(this.clienteSelecionado)[0];
            console.log('clienteRazoes: ', clienteRazoes);
            console.log('clienteId: ', clienteId);
            //Pega os usuarios selecionados
            const usuarios = this.usuarioService.buscarUsuarios().then(
              (data) => {
                console.log('DATA: ', data)
                this.usuariosEnviados = data;
                  for (let arq of data){
                    if (arq && arq.cliente && clienteId === arq.cliente.id){
                      this.usuarios.push({id: arq.id, nome: arq.nome, email: arq.email})
                    }
                  }
                console.log('Usuarios: ', this.usuarios)
              },
              err => {
                  console.log(err);
              }
            );
            const usuariosArray = this.clienteSelecionado;
            this.usuariosEnviados = usuariosArray;
            console.log('this.usuariosSelecionado: ', this.clienteSelecionado);
            console.log('this.usuariosEnviados: ', this.usuariosEnviados);
            this.mensagem = 'correto';
            this.openDialog();
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
          for (const usuario of this.clienteSelecionado) {
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
