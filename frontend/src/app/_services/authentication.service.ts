import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  #isLoggedIn: boolean = false;
  get isLoggedIn(): boolean {
    return this.#isLoggedIn;
  }
  set isLoggedIn(isLoggedIn: boolean) {
    this.#isLoggedIn = isLoggedIn;
  }

  constructor(private _jwtService: JwtHelperService,) {
    if (this.token) {
      this.isLoggedIn = true;
    }
  }

  deleteToken() {
    localStorage.removeItem(environment.tokenKey);
    this.isLoggedIn = false;
  }

  get token(): string {
    return localStorage.getItem(environment.tokenKey) as string;
  }

  set token(token: string) {
    localStorage.setItem(environment.tokenKey, token);
    this.isLoggedIn = true;
  }

  get name(): string {
    let name: string = '';
    if (this.token) {
      const decodedToken = this._jwtService.decodeToken(this.token);
      console.log("name", decodedToken.name);
      name = decodedToken.name;
    }
    return name;
  }
}
