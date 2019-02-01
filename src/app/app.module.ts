import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';

// Firebase ====================
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

// Angular Material ====================
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material";
import { MAT_DATE_LOCALE } from '@angular/material';

// Servicios ==========================
import { AuthService } from './services/auth.service';
import { ServicioService } from './services/servicios.service';
import { ProductoService } from './services/productos.service';
import { ClienteService } from './services/clientes.service';
import { ReciboService } from "./services/recibos.service";

// Componentes ========================
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login.component';
import { LayoutComponent } from './components/layout.component';
import { DashboardComponent } from './components/dashboard.component';
import { UsersComponent } from './components/users.component';
import { ClientesComponent } from './components/clientes.component';
import { VentaComponent } from './components/venta.component';
import { ProdYServComponent } from './components/prodyserv.component';
import { BuscarAgregarClienteComponent } from './components/buscaragregarcliente.component';
import { CobrarComponent } from './components/cobrar.component';
import { TicketComponent } from './components/ticket.component';
import { RecibosComponent } from './components/recibos.component';

// Rutas =============================
const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: VentaComponent },
      { path: 'db', component: DashboardComponent },
      { path: 'pys', component: ProdYServComponent },
      { path: 'tickets', component: RecibosComponent },
      { path: 'users', component: UsersComponent },
      { path: 'clientes', component: ClientesComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    UsersComponent,
    ClientesComponent,
    VentaComponent,
    ProdYServComponent,
    BuscarAgregarClienteComponent,
    CobrarComponent,
    TicketComponent,
    RecibosComponent
  ],
  entryComponents: [BuscarAgregarClienteComponent, CobrarComponent, TicketComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    // Firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    // Material
    MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule,
    MatFormFieldModule, MatSidenavModule, MatSelectModule, MatButtonToggleModule,
    MatTabsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule,
    MatRadioModule, MatProgressBarModule, MatDatepickerModule, MatNativeDateModule
  ],
  providers: [
    AuthService,
    ServicioService,
    ProductoService,
    ClienteService,
    ReciboService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: FirestoreSettingsToken, useValue: {} }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
