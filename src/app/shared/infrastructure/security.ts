import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { JwtHelper } from 'angular2-jwt';
import { BrowserStorage } from '../../store/browserStorage';
import { IUserModel } from '../../../../server/core/user';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class Security {

  private _user: IUserModel;
  private _tokenName = 'auth.token';
  private _browserStorage: BrowserStorage;

  constructor(private jwtHelper: JwtHelper) {
    this._browserStorage = new BrowserStorage();
  }

  public setToken(token: string) {
    this._browserStorage.set(this._tokenName, token);
    this.refreshUser();
  }

  public removeToken() {
    this._browserStorage.del(this._tokenName);
  }

  public getToken() {
    return this._browserStorage.get(this._tokenName);
  }

  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    return this.jwtHelper.isTokenExpired(token);
  }

  private refreshUser() {
    const token = this.getToken();
    if (!!token) {
      this._user = this.jwtHelper.decodeToken(token);
    }
  }

  public getUser(): IUserModel {
    if (this._user == null) {
      this.refreshUser();
    }
    return this._user;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this.removeToken();
    this._user = null;
  }
}
