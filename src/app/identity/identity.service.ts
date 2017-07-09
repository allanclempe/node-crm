import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpApi } from '../shared/infrastructure/httpApi';

@Injectable()
export class IdentityService {

  constructor(private http: HttpApi) {}

  /**
   * Login to identity system.
   *
   * @param email
   * @param password
   * @returns {Observable<Response>}
   */
  public login(email: string, password: string): Observable<any> {
    return this.http.post('api/identity/user/login', {
        email, password
    }).map(response => response.json());
  }
}
