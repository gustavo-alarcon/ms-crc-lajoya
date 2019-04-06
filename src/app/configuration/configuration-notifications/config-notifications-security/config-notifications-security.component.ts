import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/core/sidenav.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DatabaseService } from 'src/app/core/database.service';

@Component({
  selector: 'app-config-notifications-security',
  templateUrl: './config-notifications-security.component.html',
  styles: []
})
export class ConfigNotificationsSecurityComponent implements OnInit {

  securitySupervisorsFormControl = new FormControl();
  uploadingSecuritySupervisors: boolean = false;

  filteredUsers1: Observable<any>;

  constructor(
    public sidenav: SidenavService,
    public dbs: DatabaseService
  ) { }

  ngOnInit() {

    this.filteredUsers1 = this.securitySupervisorsFormControl.valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
        map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
      )
  }

  toggleSidenav(): void{
    this.sidenav.sidenavNotifications();
  }

  // List 1
  addSecuritySupervisors(): void {
    if (this.securitySupervisorsFormControl.value) {
      this.uploadingSecuritySupervisors = true;
      this.dbs.securitySupervisorsCollection
        .add(this.securitySupervisorsFormControl.value)
        .then(ref => {
          ref.update({
            id: ref.id,
            regDate: Date.now()
          })
          this.uploadingSecuritySupervisors = false;
          this.securitySupervisorsFormControl.setValue('');
        })
    }

  }

  deleteSecuritySupervisors(id): void {
    this.dbs.securitySupervisorsCollection.doc(id).delete();
  }

  showSelectedUser1(user): string | undefined {
    return user ? user['displayName'] : undefined;
  }

}
