import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_models/user';
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

  user: any;

  loading = false;
  successMessage: string = '';
  errorMessage: string = '';
  hasSuccess: boolean = false;
  hasError: boolean = false;

  constructor(private userService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.loading = true;
    this.userService.login(this.model)
      .then((user: User) => {

        this.loading = false;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('username', user.username);
        this.router.navigate(['']);

        this.errorMessage = '';
        this.hasError = false;
        this.hasSuccess = true;
        this.successMessage = '';
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
