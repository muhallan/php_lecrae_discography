import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
  }

  register() {
    console.log("registered");
    console.log(this.model);

    if (this.model.password !== this.model.confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    this.usersService.createUser(this.model)
      .then(user => {
        console.log("finished");
        console.log(user);
      })
      .catch(err => console.log(err));
  }
}
