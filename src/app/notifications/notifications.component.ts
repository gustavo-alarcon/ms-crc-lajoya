import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { DatabaseService } from '../core/database.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styles: []
})
export class NotificationsComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public dbs: DatabaseService
  ) { }

  ngOnInit() {
  }

  seen(id): void{
    this.auth.notificationSeen(id);
  }

  unseen(id): void{
    this.auth.notificationUnseen(id);
  }

}
