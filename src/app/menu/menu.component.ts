import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../dashboard/auth/auth.service';
import { UsuarioService } from '../dashboard/usuario/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
  ]
})
export class MenuComponent {
  private breakpointObserver = inject(BreakpointObserver);
  usuarioId: any = undefined
  usuario = {
    nome: '',
    email: '',
    endereco: '',
    telefone: '',
    tipo: ''
  }

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    ) { }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.carregarUsuario()
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
        this.usuarioId = data.id;
        this.usuario = data;
      },
      err => {
          console.log(err);
      }
  );
  }

  sair = (e:any) => {
    window.localStorage.removeItem('token');
  };
}
