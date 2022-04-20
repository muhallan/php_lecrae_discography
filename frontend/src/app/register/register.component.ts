import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../_services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  enableSearch = false;
  model: any = {};
  loading = false;

  successMessage: string = '';
  errorMessage: string = '';
  hasSuccess: boolean = false;
  hasError: boolean = false;

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    if (this.model.password !== this.model.confirmPassword) {
      this.errorMessage = "Passwords don't match";
      this.hasError = true;
      this.hasSuccess = false;
      this.successMessage = '';
      return;
    }
    this.loading = true;
    this.usersService.createUser(this.model)
      .then(user => {
        this.loading = false;
        this.errorMessage = '';
        this.hasError = false;
        this.hasSuccess = true;
        this.successMessage = "Registration successful";

        this.router.navigate(['/login']);
      })
      .catch(err => {
        this.loading = false;
        const body = JSON.parse(err._body);
        const message = body.message;

        this.errorMessage = message;
        this.hasError = true;
        this.hasSuccess = false;
        this.successMessage = '';
      });
  }
}
