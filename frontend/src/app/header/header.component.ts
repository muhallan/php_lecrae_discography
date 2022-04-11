import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  pageTitle: string = "Lecrae Discography";
  
  search_value: string = '';

  @Input()
  display: boolean = false;

  @Output()
  search_query: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  performSearch() {
    this.search_query.emit(this.search_value)
  }
}
