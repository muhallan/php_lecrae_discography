import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

import { User } from '../_models/user';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = environment.apiRoot + "users/";

  constructor(private http: HttpClient) { }

  public createUser(user: User): Promise<User> {
    return lastValueFrom(this.http.post<User>(this.usersUrl + "register", user, this.getHeaders()));
  }

  private getHeaders() {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return options;
  }

  public login(user: any) {
    return this.http.post(this.usersUrl + 'login', user, this.getHeaders())
      .then((response) => {

      });
  }

}
