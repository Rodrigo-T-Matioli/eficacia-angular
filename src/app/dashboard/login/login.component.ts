import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  login = {
    username: '',
    password: ''
  }
  hide = true;

  constructor(
    private authServide: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    try{
      console.log('Login:', this.login)
      const result = await this.authServide.login(this.login)
      console.log(`Login efetuado: ${result}`)
      this.router.navigate(['']);
    } catch (error){
      console.log(`Erro: ${error}`)
    }
  }
}
