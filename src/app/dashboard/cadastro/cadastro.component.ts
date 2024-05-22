import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

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

  constructor(
    private authServide: AuthService
  ) {}

  async onSubmit() {
    try {
      console.log(this.cadastro)
      const result = await this.authServide.createAccount(this.cadastro);
    } catch (error) {
      console.log(error);
    }
  }
}
