import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { resolve } from 'url';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ShowNotificationsComponent } from '../notifications/show-notifications/show-notifications.component';
import { FormControl } from '@angular/forms';
import { DatabaseService } from '../core/database.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: []
})
export class MainComponent implements OnInit {

  openedMenu: boolean = false;
  openedNotifications: boolean = false;
  securityOpenedFlag: boolean = false;
  qualityOpenedFlag: boolean = false;
  maintenanceOpenedFlag: boolean = false;
  ssggOpenedFlag: boolean = false;

  dateFormControl = new FormControl();

  constructor(
    public auth: AuthService,
    public dbs: DatabaseService,
    private dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
    // let firstOpen = true;
    // this.auth.currentDataNotifications.subscribe( res => {
    //   if(res.length >= 1 && firstOpen){
    //     firstOpen = false;
    //     this.dialog.open(ShowNotificationsComponent);
        
    //   }
    // })
    
  }

  ngOnInit() {
  }

  toggleSideMenu(): void {
    this.openedMenu = !this.openedMenu;
  }

  toggleSideNotifications(): void{
    this.openedNotifications = !this.openedNotifications    
  }

  securityOpened(): void{
    this.securityOpenedFlag = true;
  }

  securityClosed(): void{
    this.securityOpenedFlag = false;
  }

  qualityOpened(): void{
    this.qualityOpenedFlag = true;
  }

  qualityClosed(): void{
    this.qualityOpenedFlag = false;
  }

  maintenanceOpened(): void{
    this.maintenanceOpenedFlag = true;
  }

  maintenanceClosed(): void{
    this.maintenanceOpenedFlag = false;
  }

  ssggOpened(): void{
    this.ssggOpenedFlag = true;
  }

  ssggClosed(): void{
    this.ssggOpenedFlag = false;
  }

  showNotifications(): void {
    // 
  }

  seen(id): void{
    this.auth.notificationSeen(id);
  }

  reject(fredId, supervisorId, notificationId): void{
    this.dbs.securityFredsCollection.doc(fredId).update({status: 'Rechazado'});
    this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(fredId).update({status: 'Rechazado'});
    this.dbs.securityTasksCollection.doc(fredId).update({status: 'Rechazado'});
    this.auth.notificationsCollection.doc(notificationId).update({taskStatus: 'Rechazado'});
  }

  confirm(fredId, supervisorId, notificationId): void{
    if(this.dateFormControl.value){
      this.dbs.securityFredsCollection.doc(fredId).update({status: 'Confirmado', estimatedTerminationDate: this.dateFormControl.value.valueOf()});
      this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(fredId).update({status: 'Confirmado', estimatedTerminationDate: this.dateFormControl.value.valueOf()});
      this.dbs.securityTasksCollection.doc(fredId).update({status: 'Confirmado', estimatedTerminationDate: this.dateFormControl.value.valueOf()});
      this.auth.notificationsCollection.doc(notificationId).update({taskStatus: 'Confirmado', estimatedTerminationDate: this.dateFormControl.value.valueOf()});
    }else{
      this.snackbar.open("Debe seleccionar una fecha de cumplimiento para poder confirmar la tarea", "Cerrar", {
        duration: 6000
      });
    }
  }

}
