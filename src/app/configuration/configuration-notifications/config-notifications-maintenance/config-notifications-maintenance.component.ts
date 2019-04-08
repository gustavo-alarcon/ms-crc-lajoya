import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/core/sidenav.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-config-notifications-maintenance',
  templateUrl: './config-notifications-maintenance.component.html',
  styles: []
})
export class ConfigNotificationsMaintenanceComponent implements OnInit {

  maintenanceSupervisorsFormControl = new FormControl();
  uploadingMaintenanceSupervisors: boolean = false;

  maintenanceBroadcastFormControl = new FormControl();
  uploadingMaintenanceBroadcast: boolean = false;

  filteredUsers1: Observable<any>;
  filteredUsers2: Observable<any>;

  constructor(
    public sidenav: SidenavService,
    public dbs: DatabaseService
  ) { }

  ngOnInit() {

    this.filteredUsers1 = this.maintenanceSupervisorsFormControl.valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
        map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
      )

    this.filteredUsers2 = this.maintenanceBroadcastFormControl.valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
        map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
      )
  }

  toggleSidenav(): void{
    this.sidenav.sidenavNotifications();
  }

  // SUPERVISORS
  addMaintenanceSupervisors(): void {
    if (this.maintenanceSupervisorsFormControl.value) {
      this.uploadingMaintenanceSupervisors = true;
      this.dbs.maintenanceSupervisorsCollection
        .add(this.maintenanceSupervisorsFormControl.value)
        .then(ref => {
          ref.update({
            id: ref.id,
            regDate: Date.now()
          })
          this.uploadingMaintenanceSupervisors = false;
          this.maintenanceSupervisorsFormControl.setValue('');
        })
    }

  }

  deleteMaintenanceSupervisors(id): void {
    this.dbs.maintenanceSupervisorsCollection.doc(id).delete();
  }

  showSelectedUser1(user): string | undefined {
    return user ? user['displayName'] : undefined;
  }

  // BROADCAST
  addMaintenanceBroadcast(): void {
    if (this.maintenanceBroadcastFormControl.value) {
      this.uploadingMaintenanceBroadcast = true;
      this.dbs.maintenanceBroadcastListCollection
        .add(this.maintenanceBroadcastFormControl.value)
        .then(ref => {
          ref.update({
            id: ref.id,
            regDate: Date.now()
          })
          this.uploadingMaintenanceBroadcast = false;
          this.maintenanceBroadcastFormControl.setValue('');
        })
    }

  }

  deleteMaintenanceBroadcast(id): void {
    this.dbs.maintenanceBroadcastListCollection.doc(id).delete();
  }


}
