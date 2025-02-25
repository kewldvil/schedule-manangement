import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Location} from "../interfaces/location";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {
  }

  createLocation(location: Location) {
    return this.http.post(environment.apiUrl + '/locations', location);
  }

  listAllLocations() {
    return this.http.get<Location>(environment.apiUrl + '/locations');
  }

  updateLocation(location: Location) {
    return this.http.put(environment.apiUrl + '/locations/' + location.id, location);
  }

  deleteLocation(location: Location) {
    return this.http.delete(environment.apiUrl + '/locations/' + location.id);
  }
}
