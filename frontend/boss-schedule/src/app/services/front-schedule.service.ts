import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Schedule} from "../models/schedule";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FrontScheduleService {
  constructor(private http: HttpClient) {
  }
  listAllPendingSchedules() {
    return this.http.get<Schedule>(environment.apiUrl + '/schedules/pending');
  }
  updatePendingToComplete(){
    return this.http.get(environment.apiUrl + '/schedules/trigger');
  }
}
