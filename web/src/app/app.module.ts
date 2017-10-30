/**
 * This TypeScript file is used to bind all of the different components, modules, and services together.
 * This is so that Angular knows how to put everything together properly.
 */
//Imports for the modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module'; // This module allows for the routing between pages
import { HttpModule } from '@angular/http'; // This module allows us to make HTTP calls
import { FormsModule } from '@angular/forms'; // This module allows us to have two-way data binding in forms

//References to all the components in the application
import { AppComponent } from './app.component';
import { NotFoundComponent } from './notFound.component';
import { HomeComponent } from './home.component';
import { UserComponent } from './user.component';
import { UserSettingsComponent } from './user-settings.component';
import { UploadComponent } from './upload.component';
import { LoginComponent } from './login.component';
import { ReportComponent } from './report.component';
import { SelectStyleComponent } from './select-style.component';
import { RegisterComponent } from './register.component';
import { SystemStatsComponent } from './system-stats.component';
import { SearchComponent } from './search.component';
import { LibraryComponent } from './library.component';
import { ModalComponent } from './modal/app-modal.component';

//References to all the services in the application
import { DBService } from './services/db.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    UserComponent,
    UserSettingsComponent,
    UploadComponent,
    LoginComponent,
    ReportComponent,
    SelectStyleComponent,
    RegisterComponent,
    SystemStatsComponent,
    SearchComponent,
    LibraryComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule
  ],
  providers: [
    DBService,
    UserService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
