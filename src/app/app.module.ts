import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {UserFilterPipe} from './shared/user-filter.pipe';
import { HeaderComponent } from './header/header.component';
import {Routes, RouterModule} from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { RegistrationComponent } from './registration/registration.component';
import { FilmComponent } from './film/film.component';

const appRoutes: Routes = [
  { path: '', component: FooterComponent},
  { path: 'user', component: UserComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'movies', component: FilmComponent},
  { path: '**', component: FooterComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    UserFilterPipe,
    HeaderComponent,
    FooterComponent,
    RegistrationComponent,
    FilmComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
