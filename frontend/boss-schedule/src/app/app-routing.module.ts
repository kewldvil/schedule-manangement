import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ScheduleFrontComponent} from "./pages/schedule-front/schedule-front.component";
import {ScheduleBackComponent} from "./pages/schedule-back/schedule-back.component";

const routes: Routes = [
  {path: '', redirectTo: 'view', pathMatch: 'full'},
  {path:'view',component:ScheduleFrontComponent},
  {path:'create',component:ScheduleBackComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
