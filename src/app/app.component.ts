import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import { CobrancasComponent } from './dashboard/cobrancas/cobrancas.component';
import { DadosRecebidosComponent } from './dashboard/dados-recebidos/dados-recebidos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EnviarComponent } from './dashboard/enviar/enviar.component';
import { MenuComponent } from './menu/menu.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuComponent,
    DashboardComponent,
    DadosRecebidosComponent,
    MatCardModule,
    CobrancasComponent,
    EnviarComponent,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dashboard';
}
