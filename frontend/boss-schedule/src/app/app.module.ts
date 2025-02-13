import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScheduleFrontComponent } from './pages/schedule-front/schedule-front.component';
import { ScheduleBackComponent } from './pages/schedule-back/schedule-back.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CreateScheduleComponent } from './components/create-schedule/create-schedule.component';
import { PresidiumComponent } from './components/presidium/presidium.component';
import { UniformComponent } from './components/uniform/uniform.component';
import { LocationComponent } from './components/location/location.component';

@NgModule({
  declarations: [
    AppComponent,
    ScheduleFrontComponent,
    ScheduleBackComponent,
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    CreateScheduleComponent,
    PresidiumComponent,
    UniformComponent,
    LocationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
