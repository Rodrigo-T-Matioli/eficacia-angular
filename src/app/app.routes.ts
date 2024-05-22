import { Routes } from '@angular/router';
import { AdmindocumentosComponent } from './dashboard/admindocumentos/admindocumentos.component';
import { AdminusuariosComponent } from './dashboard/adminusuarios/adminusuarios.component';
import { AutenticationComponent } from './dashboard/autentication/autentication.component';
import { AuthGuard } from './dashboard/auth/auth.guard';
import { CadastroComponent } from './dashboard/cadastro/cadastro.component';
import { CobrancasComponent } from './dashboard/cobrancas/cobrancas.component';
import { CriarclienteComponent } from './dashboard/criarcliente/criarcliente.component';
import { DadosRecebidosComponent } from './dashboard/dados-recebidos/dados-recebidos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EnviarComponent } from './dashboard/enviar/enviar.component';
import { HomeComponent } from './dashboard/home/home.component';
import { LoginComponent } from './dashboard/login/login.component';

export const routes: Routes = [
  {
    path:"",
    component: HomeComponent,
    children: [
      {
        path:"",
        component: DashboardComponent,
      },
      {
        path:"dados-recebidos",
        component: DadosRecebidosComponent,
      },
      {
        path:"app-cobrancas",
        component: CobrancasComponent,
      },
      {
        path:"app-enviar",
        component: EnviarComponent,
      },
      {
        path:"admin-dados",
        component: AdmindocumentosComponent,
      },
      {
        path:"admin-usuario",
        component: AdminusuariosComponent,
      },
      {
        path:"admin-cliente",
        component: CriarclienteComponent,
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path:"",
    component: AutenticationComponent,
    children: [
      {
        path:"",
        redirectTo: "login",
        pathMatch: "full",
      },
      {
        path:"login",
        component: LoginComponent,
      },
      {
        path:"cadastrar",
        component: CadastroComponent,
      },
    ]
  },
];
