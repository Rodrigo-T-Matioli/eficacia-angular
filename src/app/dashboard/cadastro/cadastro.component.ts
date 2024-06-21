import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export interface DialogData {
  mensagem: string,
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  cadastro = {
    nome: '',
    email: '',
    endereco: '',
    telefone: '',
    senha: '',
  }
  hide = true;
  mensagem: string = '';

  constructor(
    private authServide: AuthService,
    public dialog: Dialog
  ) {}

  async onSubmit() {
    try {
      console.log(this.cadastro)
      const result = await this.authServide.createAccount(this.cadastro).then((data: any) => {
        if (data) {
          this.mensagem = 'usuarioCriado';
          this.openDialog();
        } else {
          this.mensagem = 'usuarioErro';
          this.openDialog();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open<string>(CdkDialogOverviewExampleDialog, {
      width: '510px',
      data: {
        mensagem: this.mensagem,
      },
    });

    dialogRef.closed.subscribe(result => {
      window.location.reload();
      return
    });
  }

}

@Component({
  selector: 'cadastro-dialog',
  templateUrl: 'cadastro-dialog.html',
  styleUrl: 'cadastro-dialog.css',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
})
export class CdkDialogOverviewExampleDialog {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: DialogData,
  ) {}
}
