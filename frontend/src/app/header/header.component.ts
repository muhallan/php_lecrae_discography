import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  pageTitle: string = "Lecrae Discography";
  
  search_value: string = '';
  name: string | null = '';
  isLoggedIn = false;

  selectedLimit = 5;

  @Input()
  display: boolean = false;

  @Output()
  search_query: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  limit: EventEmitter<number> = new EventEmitter<number>();

  constructor(private router: Router, private _authService: AuthenticationService) { }

  ngOnInit(): void {
    this.name = this._authService.name;
    this.isLoggedIn = this._authService.isLoggedIn;
  }

  performSearch() {
    this.search_query.emit(this.search_value)
  }

  logout() {
    this._authService.deleteToken();
    this.router.navigate(['/login']);
  }

  onLimitChange(newValue: string) {
    this.selectedLimit = parseInt(newValue);
    this.limit.emit(this.selectedLimit);
  }
}
