import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { FormControl } from '@angular/forms';
import { Subscribable, Subscription, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { SidenavService } from 'src/app/core/sidenav.service';

@Component({
  selector: 'app-config-notifications-quality',
  templateUrl: './config-notifications-quality.component.html',
  styles: []
})
export class ConfigNotificationsQualityComponent implements OnInit, OnDestroy {

  qualityRedoQualityAnalystsFormControl = new FormControl();
  uploadingQualityRedoQualityAnalysts: boolean = false;
  

  qualityRedoTechniciansFormControl = new FormControl();
  uploadingQualityRedoTechnicians: boolean = false;
  

  qualityRedoConfirmationListFormControl = new FormControl();
  uploadingQualityRedoConfirmationList: boolean = false;
  

  filteredUsers1: Observable<any>;
  filteredUsers2: Observable<any>;
  filteredUsers3: Observable<any>;

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    public sidenav: SidenavService

  ) { }

  ngOnInit() {

    this.filteredUsers1 = this.qualityRedoQualityAnalystsFormControl.valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
        map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
      )

    this.filteredUsers2 = this.qualityRedoTechniciansFormControl.valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
        map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
      )

    this.filteredUsers3 = this.qualityRedoConfirmationListFormControl.valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
        map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
      )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleSidenav(): void {
    this.sidenav.sidenavNotifications();
  }

  // List 1
  addQualityRedoQualityAnalysts(): void {
    if (this.qualityRedoQualityAnalystsFormControl.value) {
      this.uploadingQualityRedoQualityAnalysts = true;
      this.dbs.qualityRedoQualityAnalystsCollection
        .add(this.qualityRedoQualityAnalystsFormControl.value)
        .then(ref => {
          ref.update({
            id: ref.id,
            regDate: Date.now()
          })
          this.uploadingQualityRedoQualityAnalysts = false;
          this.qualityRedoQualityAnalystsFormControl.setValue('');
        })
    }

  }

  deleteQualityRedoQualityAnalysts(id): void {
    this.dbs.qualityRedoQualityAnalystsCollection.doc(id).delete();
  }

  // List 2
  addQualityRedoTechnicians(): void {
    if (this.qualityRedoTechniciansFormControl.value) {
      this.uploadingQualityRedoTechnicians = true;
      this.dbs.qualityRedoTechniciansCollection
        .add(this.qualityRedoTechniciansFormControl.value)
        .then(ref => {
          ref.update({
            id: ref.id,
            regDate: Date.now()
          })
          this.uploadingQualityRedoTechnicians = false;
          this.qualityRedoTechniciansFormControl.setValue('');
        })
    }

  }

  deleteQualityRedoTechnicians(id): void {
    this.dbs.qualityRedoTechniciansCollection.doc(id).delete();
  }

  // List 3
  addQualityRedoConfirmationList(): void {
    if (this.qualityRedoConfirmationListFormControl.value) {
      this.uploadingQualityRedoConfirmationList = true;
      this.dbs.qualityRedoConfirmationListCollection
        .add(this.qualityRedoConfirmationListFormControl.value)
        .then(ref => {
          ref.update({
            id: ref.id,
            regDate: Date.now()
          })
          this.uploadingQualityRedoConfirmationList = false;
          this.qualityRedoConfirmationListFormControl.setValue('');
        })
    }

  }

  deleteQualityRedoConfirmationList(id): void {
    this.dbs.qualityRedoConfirmationListCollection.doc(id).delete();
  }

  showSelectedUser1(user): string | undefined {
    return user ? user['displayName'] : undefined;
  }

  showSelectedUser2(user): string | undefined {
    return user ? user['displayName'] : undefined;
  }

  showSelectedUser3(user): string | undefined {
    return user ? user['displayName'] : undefined;
  }



}
