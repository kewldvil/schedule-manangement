import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ScheduleFrontComponent} from "./pages/schedule-front/schedule-front.component";
import {ScheduleBackComponent} from "./pages/schedule-back/schedule-back.component";
import {CreateScheduleComponent} from "./components/create-schedule/create-schedule.component";
import {PresidiumComponent} from "./components/presidium/presidium.component";
import {UniformComponent} from "./components/uniform/uniform.component";
import {LocationComponent} from "./components/location/location.component";

const routes: Routes = [
  {path: '', redirectTo: 'view', pathMatch: 'full'},
  {path:'view',component:ScheduleFrontComponent},
  {path:'admin',component:ScheduleBackComponent,children:[
      {path:'',redirectTo:'create',pathMatch:'full'},
      {
        path:'create',
        component:CreateScheduleComponent,
      },
      {
        path:'presidium',
        component:PresidiumComponent,
        data:{title:'អធិបតី'}
      },
      {
        path:'uniform',
        component:UniformComponent,
        data:{title:'ឯកសណ្ឋាន'}
      },
      {
        path:'location',
        component:LocationComponent,
        data:{title:'ទីតាំង'}
      }
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
