import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Presidium} from "../interfaces/presidium";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PresidiumService {
  constructor(private http: HttpClient) {
  }

  createPresidium(presidium: Presidium) {
    return this.http.post(environment.apiUrl + '/presidiums', presidium);
  }

  listAllPresidiums() {
    return this.http.get<Presidium>(environment.apiUrl + '/presidiums');
  }

  updatePresidium(presidium: Presidium) {
    return this.http.put(environment.apiUrl + '/presidiums/' + presidium.id, presidium);
  }

  deletePresidium(presidium: Presidium) {
    return this.http.put(environment.apiUrl + '/presidiums/delete' , presidium.id);
  }
}
