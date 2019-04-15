import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { resolve } from 'url';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ShowNotificationsComponent } from '../notifications/show-notifications/show-notifications.component';
import { FormControl } from '@angular/forms';
import { DatabaseService } from '../core/database.service';
import { ChangePasswordComponent } from './change-password/change-password.component';

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

  dateSecurityFredFormControl = new FormControl();
  dateSecurityInspectionObservationFormControl = new FormControl();
  dateMaintenanceRequestsConfirmationFormControl = new FormControl();
  dateQualitySingleObservationFormControl = new FormControl();
  dateQualityInspectionObservationFormControl = new FormControl();
  dateSsggRequestsConfirmationFormControl = new FormControl();

  constructor(
    public auth: AuthService,
    public dbs: DatabaseService,
    private dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
    
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

  changePassword(): void{
    this.dialog.open(ChangePasswordComponent);
  }

  // REJECT AND CONFIRMATION FOR TASK CREATED BY FRED

  reject(fredId, supervisorId, notificationId): void{
    this.dbs.securityFredsCollection.doc(fredId).update({status: 'Rechazado'});
    this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(fredId).update({status: 'Rechazado'});
    this.dbs.securityTasksCollection.doc(fredId).update({status: 'Rechazado'});
    this.auth.notificationsCollection.doc(notificationId).update({taskStatus: 'Rechazado'});
  }

  confirm(fredId, supervisorId, notificationId): void{
    if(this.dateSecurityInspectionObservationFormControl.value){
      this.dbs.securityFredsCollection.doc(fredId).update({status: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf()});
      this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(fredId).update({status: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf()});
      this.dbs.securityTasksCollection.doc(fredId).update({status: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf()});
      this.auth.notificationsCollection.doc(notificationId).update({taskStatus: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf()});
    }else{
      this.snackbar.open("Debe seleccionar una fecha de cumplimiento para poder confirmar la tarea", "Cerrar", {
        duration: 6000
      });
    }
  }

  // REJECT AND CONFIRMATION FOR TASKs CREATED BY OBSERVATIONS ON INSPECTIONS
  rejectSecurityInspectionObservation(inspectionId, observationId, supervisorId, notificationId): void{
    this.dbs.securityInspectionsCollection.doc(inspectionId).collection(`observations`).doc(observationId).update({status: 'Rechazado'});
    this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(observationId).update({status: 'Rechazado'});
    this.dbs.securityTasksCollection.doc(observationId).update({status: 'Rechazado'});
    this.auth.notificationsCollection.doc(notificationId).update({taskStatus: 'Rechazado'});
  }

  confirmSecurityInspectionObservation(inspectionId, observationId, supervisorId, notificationId): void{
    if(this.dateSecurityInspectionObservationFormControl.value){
      this.dbs.securityInspectionsCollection.doc(inspectionId).collection(`observations`).doc(observationId).update({status: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf()});
      this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(observationId).update({status: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf()});
      this.dbs.securityTasksCollection.doc(observationId).update({status: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf()});
      this.auth.notificationsCollection.doc(notificationId).update({taskStatus: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf()});
    }else{
      this.snackbar.open("Debe seleccionar una fecha de cumplimiento para poder confirmar la tarea", "Cerrar", {
        duration: 6000
      });
    }
  }

  // REJECT AND CONFIRMATION FOR TASKs CREATED BY OBSERVATIONS ON INSPECTIONS
  rejectQualityRedo(redoId, supervisorId, noteId): void{
    this.dbs.qualityRedosCollection.doc(redoId).update({status: 'Rechazado'});
    this.dbs.usersCollection.doc(supervisorId).collection('notifications').doc(noteId).update({redoStatus: 'Rechazado'});
  }

  confirmQualityRedo(redoId, supervisorId, noteId): void{
    this.dbs.qualityRedosCollection.doc(redoId).update({status: 'Confirmado'});
    this.dbs.usersCollection.doc(supervisorId).collection('notifications').doc(noteId).update({redoStatus: 'Confirmado'});
  }

  // REJECT AND CONFIRMATION FOR TASKs CREATED BY REDOs ACTIONS
  rejectQualityRedoAction(redoId, responsibleId, noteId, taskId): void{
    this.dbs.qualityRedosCollection.doc(redoId).collection('actions').doc(taskId).update({status: 'Rechazado'});
    this.dbs.usersCollection.doc(responsibleId).collection('tasks').doc(taskId).update({status: 'Rechazado'});
    this.dbs.usersCollection.doc(responsibleId).collection('notifications').doc(noteId).update({actionStatus: 'Rechazado'});
  }

  confirmQualityRedoAction(redoId, responsibleId, noteId, taskId): void{
    this.dbs.qualityRedosCollection.doc(redoId).collection('actions').doc(taskId).update({status: 'Confirmado'});
    this.dbs.usersCollection.doc(responsibleId).collection('tasks').doc(taskId).update({status: 'Confirmado'});
    this.dbs.usersCollection.doc(responsibleId).collection('notifications').doc(noteId).update({actionStatus: 'Confirmado'});
  }

  // REJECT AND CONFIRMATION CLOSING REQUEST
  rejectRequestClosing(redoId , noteId, signId): void{
    this.dbs.qualityRedosCollection.doc(redoId).collection('signing').doc(signId).update({sign: false});
    this.dbs.usersCollection.doc(this.auth.userCRC.uid).collection('notifications').doc(noteId).update({requestStatus: 'Rechazado'});
  }

  confirmRequestClosing(redoId , noteId, signId): void{
    this.dbs.qualityRedosCollection.doc(redoId).collection('signing').doc(signId).update({sign: true});
    this.dbs.usersCollection.doc(this.auth.userCRC.uid).collection('notifications').doc(noteId).update({requestStatus: 'Confirmado'});
  }

  // REJECT AND CONFIRMATION MAINTENANCE REQUEST
  rejectMaintenanceRequest(requestId, notificationId): void{
    this.dbs.maintenanceRequestsCollection.doc(requestId).update({status: 'Rechazado'});
    this.auth.notificationsCollection.doc(notificationId).update({taskStatus: 'Rechazado'});
  }

  confirmMaintenanceRequest(requestId, notificationId): void{
    if(this.dateMaintenanceRequestsConfirmationFormControl.value){
      this.dbs.maintenanceRequestsCollection.doc(requestId).update({status: 'Confirmado', estimatedTerminationDate: this.dateMaintenanceRequestsConfirmationFormControl.value.valueOf()});
      this.auth.notificationsCollection.doc(notificationId).update({estimatedTerminationDate: this.dateMaintenanceRequestsConfirmationFormControl.value.valueOf()});
    }else{
      this.snackbar.open("Debe seleccionar una fecha de cumplimiento para poder confirmar la solicitud", "Cerrar", {
        duration: 6000
      });
    }
  }

  // REJECT AND CONFIRMATION FOR TASKs CREATED BY OBSERVATIONS ON QUALITY INSPECTIONS
  rejectQualityInspectionObservation(inspectionId, observationId, supervisorId, notificationId): void{
    this.dbs.qualityInspectionsCollection.doc(inspectionId).collection(`observations`).doc(observationId).update({status: 'Rechazado'});
    this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(observationId).update({status: 'Rechazado'});
    this.dbs.qualityTasksCollection.doc(observationId).update({status: 'Rechazado'});
    this.auth.notificationsCollection.doc(notificationId).update({taskStatus: 'Rechazado'});
  }

  confirmQualityInspectionObservation(inspectionId, observationId, supervisorId, notificationId): void{
    if(this.dateQualityInspectionObservationFormControl.value){
      this.dbs.qualityInspectionsCollection.doc(inspectionId).collection(`observations`).doc(observationId).update({status: 'Confirmado', estimatedTerminationDate: this.dateQualityInspectionObservationFormControl.value.valueOf()});
      this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(observationId).update({status: 'Confirmado', estimatedTerminationDate: this.dateQualityInspectionObservationFormControl.value.valueOf()});
      this.dbs.qualityTasksCollection.doc(observationId).update({status: 'Confirmado', estimatedTerminationDate: this.dateQualityInspectionObservationFormControl.value.valueOf()});
      this.auth.notificationsCollection.doc(notificationId).update({taskStatus: 'Confirmado', estimatedTerminationDate: this.dateQualityInspectionObservationFormControl.value.valueOf()});
    }else{
      this.snackbar.open("Debe seleccionar una fecha de cumplimiento para poder confirmar la tarea", "Cerrar", {
        duration: 6000
      });
    }
  }

  // REJECT AND CONFIRMATION SINGLE OBSERVATION
  rejectQualitySingleObservation(observationId, notificationId): void{
    this.dbs.qualitySingleObservationsCollection.doc(observationId).update({status: 'Rechazado'});
    this.auth.notificationsCollection.doc(notificationId).update({taskStatus: 'Rechazado'});
  }

  confirmQualitySingleObservation(observationId, notificationId): void{
    if(this.dateQualitySingleObservationFormControl.value){
      this.dbs.qualitySingleObservationsCollection.doc(observationId).update({status: 'Confirmado', estimatedTerminationDate: this.dateQualitySingleObservationFormControl.value.valueOf()});
      this.auth.notificationsCollection.doc(notificationId).update({estimatedTerminationDate: this.dateQualitySingleObservationFormControl.value.valueOf()});
    }else{
      this.snackbar.open("Debe seleccionar una fecha de cumplimiento para poder confirmar la solicitud", "Cerrar", {
        duration: 6000
      });
    }
  }

  // REJECT AND CONFIRMATION FOR SSGG REQUESTS

  rejectSsggRequest(requestId, areaSupervisorId, notificationId): void{
    this.dbs.ssggRequestsCollection.doc(requestId).update({status: 'Rechazado'});
    let supervisorList = this.dbs.ssggSupervisors.slice();
    supervisorList.forEach(user =>{
      this.dbs.usersCollection
        .doc(user['uid'])
        .collection('notifications')
        .doc(requestId)
        .update({requestStatus: 'Rechazado'})
    })
    this.dbs.usersCollection.doc(areaSupervisorId).collection(`tasks`).doc(requestId).update({status: 'Rechazado'});
  }

  confirmSsggRequest(requestId, areaSupervisorId, notificationId): void{
    if(this.dateSsggRequestsConfirmationFormControl.value){
      this.dbs.ssggRequestsCollection.doc(requestId).update({status: 'Confirmado', estimatedTerminationDate: this.dateSsggRequestsConfirmationFormControl.value.valueOf()});
      let supervisorList = this.dbs.ssggSupervisors.slice();
      supervisorList.forEach(user =>{
        this.dbs.usersCollection
          .doc(user['uid'])
          .collection('notifications')
          .doc(requestId)
          .update({requestStatus: 'Confirmado', estimatedTerminationDate: this.dateSsggRequestsConfirmationFormControl.value.valueOf()})
      })
      this.dbs.usersCollection.doc(areaSupervisorId).collection(`tasks`).doc(requestId).update({status: 'Confirmado', estimatedTerminationDate: this.dateSsggRequestsConfirmationFormControl.value.valueOf()});
    }else{
      this.snackbar.open("Debe seleccionar una fecha de cumplimiento para poder confirmar la tarea", "Cerrar", {
        duration: 6000
      });
    }
  }

  

}
