import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse } from '../_models/login-response';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { UsersService } from '../_services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  enableSearch = false;

  model = {
    username: '',
    password: ''
  };

  loading = false;
  successMessage: string = '';
  errorMessage: string = '';
  hasSuccess: boolean = false;
  hasError: boolean = false;

  constructor(private userService: UsersService, private router: Router, private _authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  login() {
    this.loading = true;
    this.userService.login(this.model)
      .then((loginResponse: LoginResponse) => {
        this.loading = false;

        this.errorMessage = '';
        this.hasError = false;
        this.hasSuccess = true;
        this.successMessage = '';

        this._authService.token = loginResponse.token;
        this.router.navigate(['']);
      })
      .catch((err: HttpErrorResponse) => {
        this.loading = false;
        if (err.error instanceof Error) {
          this.errorMessage = "An error has occurred. Please try again";
          this.hasError = true;
          this.hasSuccess = false;
          this.successMessage = '';
        } else {
          let message: string | null;
          if (err.status === 401) {
            message = "Invalid username or password";
          } else if (err.status === 500) {
            message = "An internal server error occurred";
          } else {
            message = "An error has occurred. Please try again";
          }
          this.errorMessage = message;
          this.hasError = true;
          this.hasSuccess = false;
          this.successMessage = '';
        }
      });
  }
}
