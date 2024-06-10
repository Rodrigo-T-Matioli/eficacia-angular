import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './auth/auth.service';
import { UsuarioService } from './usuario/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})

export class DashboardComponent implements OnInit {
  arquivosDocumentos: any = undefined;
  arquivosCobrancas: any;
  usuarioId: any = undefined;
  usuario = {
    nome: undefined,
    email: undefined,
    endereco: undefined,
    telefone: undefined
  }
  recarregar: boolean = false;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    ) { }

  async ngOnInit() {
    await this.carregarUsuario();
    if (window.localStorage) {
      if (!localStorage.getItem('reload')) {
          localStorage['reload'] = true;
          window.location.reload();
      } else {
          localStorage.removeItem('reload');
      }
    }
  }

  async carregarUsuario() {
    await this.authService.getUser().then(
      (data: any) => {
        if (data) {
          this.usuarioId = data.id;
          this.buscarUsuario(data);
        }
      },
      err => {
          console.log(err);
      }
    );
  }

  async buscarUsuario( data: any ) {
    await this.usuarioService.buscarUsuario(data.id).then(
      (data) => {
          if (data)
            this.usuario = data;
      },
      err => {
          console.log(err);
      }
  );
  }
}
