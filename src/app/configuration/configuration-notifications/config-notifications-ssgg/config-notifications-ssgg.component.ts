import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/core/sidenav.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-config-notifications-ssgg',
  templateUrl: './config-notifications-ssgg.component.html',
  styles: []
})
export class ConfigNotificationsSsggComponent implements OnInit {

  ssggSupervisorsFormControl = new FormControl();
  uploadingSsggSupervisors: boolean = false;

  filteredUsers1: Observable<any>;

  constructor(
    public sidenav: SidenavService,
    public dbs: DatabaseService
  ) { }

  ngOnInit() {
    this.filteredUsers1 = this.ssggSupervisorsFormControl.valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
        map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
      )
  }

  toggleSidenav(): void{
    this.sidenav.sidenavSystem();
  }

  // List 1
  addSsggSupervisors(): void {
    if (this.ssggSupervisorsFormControl.value) {
      this.uploadingSsggSupervisors = true;
      this.dbs.ssggSupervisorsCollection
        .add(this.ssggSupervisorsFormControl.value)
        .then(ref => {
          ref.update({
            id: ref.id,
            regDate: Date.now()
          })
          this.uploadingSsggSupervisors = false;
          this.ssggSupervisorsFormControl.setValue('');
        })
    }

  }

  deleteSsggSupervisors(id): void {
    this.dbs.ssggSupervisorsCollection.doc(id).delete();
  }

  showSelectedUser1(user): string | undefined {
    return user ? user['displayName'] : undefined;
  }

}
