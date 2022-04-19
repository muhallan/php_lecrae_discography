import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../_services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  pageTitle: string = "Lecrae Discography";
  
  search_value: string = '';
  username: string | null = '';
  isLoggedIn = false;

  @Input()
  display: boolean = false;

  @Output()
  search_query: EventEmitter<string> = new EventEmitter<string>();

  constructor(private router: Router, private usersService: UsersService) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    if (this.username) {
      this.isLoggedIn = true;
    }
  }

  performSearch() {
    this.search_query.emit(this.search_value)
  }

  logout() {
    this.router.navigate(['/login']);
    this.usersService.logout();
  }
}
