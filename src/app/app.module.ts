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
import { GenreComponent } from './genre/genre.component';
import { MessageComponent } from './message/message.component';
import { HallComponent } from './hall/hall.component';
import { OrderComponent } from './order/order.component';
import { PlaceComponent } from './place/place.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { HelloComponent } from './hello/hello.component';

const appRoutes: Routes = [
  { path: '', component: HelloComponent},
  { path: 'user', component: UserComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'films', component: FilmComponent},
  { path: 'genres', component: GenreComponent},
  { path: 'halls', component: HallComponent},
  { path: 'messages', component: MessageComponent},
  { path: 'orders', component: OrderComponent},
  { path: 'places', component: PlaceComponent},
  { path: 'schedules', component: ScheduleComponent},
  { path: '**', component: HelloComponent },
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
    GenreComponent,
    MessageComponent,
    HallComponent,
    OrderComponent,
    PlaceComponent,
    ScheduleComponent,
    HelloComponent,
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
