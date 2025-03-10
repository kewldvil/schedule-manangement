import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {environment} from "../../environments/environment";
import {Schedule} from "../models/schedule";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private http: HttpClient) {
  }

  createSchedule(schedule: Schedule) {
    return this.http.post(environment.apiUrl + '/schedules', schedule);
  }

  listAllSchedules(page:number,size:number) {
    return this.http.get<Schedule>(environment.apiUrl + `/schedules?page=${page}&size=${size}`);
  }

  updateSchedule(schedule: Schedule) {
    return this.http.put(environment.apiUrl + '/schedules/' + schedule.id, schedule);
  }
  deleteSchedule(schedule: Schedule) {
    return this.http.delete(environment.apiUrl + '/schedules/' + schedule.id);
  }
}
