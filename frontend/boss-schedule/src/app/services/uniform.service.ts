import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Uniform} from "../interfaces/uniform";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UniformService {
  constructor(private http: HttpClient) {
  }

  createUniform(uniform: Uniform) {
    return this.http.post(environment.apiUrl + '/uniforms', uniform);
  }

  listAllUniforms() {
    return this.http.get<Uniform>(environment.apiUrl + '/uniforms');
  }

  updateUniform(uniform: Uniform) {
    return this.http.put(environment.apiUrl + '/uniforms/' + uniform.id, uniform);
  }

  deleteUniform(uniform: Uniform) {
    return this.http.delete(environment.apiUrl + '/uniforms/' + uniform.id);
  }
}
