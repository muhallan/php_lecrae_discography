import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  enableSearch = false;

  model = {
    email: '',
    password: ''
  };

  user: any;

  loading = false;

  constructor() { }

  ngOnInit(): void {
  }

  login() {
    
  }
}
