import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { environment } from '../../environments/environments';
import { ClientesService } from '../clientes/clientes.service';

export interface DialogData {
  mensagem: string,
  ok: string,
  cancel: string,
}

@Component({
  selector: 'app-criarcliente',
  standalone: true,
  imports: [
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './criarcliente.component.html',
  styleUrl: './criarcliente.component.css'
})
export class CriarclienteComponent implements OnInit {
  clientesConsulta: any;
  cliente = {
    razaoSocial: '',
    endereco: ''
  }
  mensagem: string = '';

  constructor(
    private http: HttpClient,
    public dialog: Dialog,
    private clientesService: ClientesService,
    ) { }

  ngOnInit(): void {
    this.buscarClientes();
  }

  changeRazaoSocialValue(e: any) {
    this.cliente.razaoSocial = e.target.value;
  }

  changeEnderecoValue(e: any) {
    this.cliente.endereco = e.target.value;
  }

  buscarClientes() {
    this.clientesService.buscarClientes().then(
      (data) => {
          this.clientesConsulta = data;
      },
      err => {
          console.log(err);
      }
  );
  }

  onCriarCliente() {
    if (this.cliente.razaoSocial) {
      if (this.cliente.endereco) {
        const dadosCliente$ = this.http.post(`${environment.api}/clientes`, this.cliente);
        dadosCliente$.subscribe((response) => {
          console.log('Post criado: ', response)
          if (response) {
            this.mensagem = 'criadoSucesso';
            this.openDialog();
          } else {
            this.mensagem = 'erroCriar';
            this.openDialog();
          }
        });
      } else {
        this.mensagem = 'faltaEndereco';
        this.openDialog();
      }
    } else {
      this.mensagem = 'faltaRazao'
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

}

@Component({
  selector: 'criarcliente-dialog',
  templateUrl: 'criarcliente-dialog.html',
  styleUrl: 'criarcliente-dialog.css',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
})
export class CdkDialogOverviewExampleDialog {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: DialogData,
  ) {}
}
