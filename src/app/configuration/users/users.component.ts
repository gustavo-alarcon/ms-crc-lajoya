import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/core/sidenav.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {

  constructor(
    public sidenav: SidenavService
  ) { }

  ngOnInit() {
  }

}
