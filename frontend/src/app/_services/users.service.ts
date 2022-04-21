import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

import { User } from '../_models/user';
import { LoginResponse } from '../_models/login-response';
import { Credentials } from '../_models/credentials';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = environment.apiRoot + "users/";

  constructor(private http: HttpClient) { }

  public createUser(credentials: Credentials): Promise<User> {
    return lastValueFrom(this.http.post<User>(this.usersUrl + "register", credentials, this.getHeaders()));
  }

  private getHeaders() {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return options;
  }

  public login(credentials: {username: string, password: string}): Promise<LoginResponse> {
    return lastValueFrom(this.http.post<LoginResponse>(this.usersUrl + 'login', credentials, this.getHeaders()));
  }
}
