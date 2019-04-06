import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { DatabaseService } from '../core/database.service';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styles: []
})
export class NotificationsComponent implements OnInit {

  dateSecurityFredFormControl = new FormControl();
  dateSecurityInspectionObservationFormControl = new FormControl();

  constructor(
    public auth: AuthService,
    public dbs: DatabaseService,
    public snackbar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  seen(id): void{
    this.auth.notificationSeen(id);
  }

  unseen(id): void{
    this.auth.notificationUnseen(id);
  }

  deleteNotification(id): void{
    this.auth.notificationsCompleteCollection.doc(id).delete();
  }

  // REJECT AND CONFIRMATION FOR TASKs CREATED BY FRED
  reject(fredId, supervisorId, notificationId): void{
    this.dbs.securityFredsCollection.doc(fredId).update({status: 'Rechazado'});
    this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(fredId).update({status: 'Rechazado'});
    this.dbs.securityTasksCollection.doc(fredId).update({status: 'Rechazado'});
    this.auth.notificationsCollection.doc(notificationId).update({taskStatus: 'Rechazado'});
  }

  confirm(fredId, supervisorId, notificationId): void{
    if(this.dateSecurityFredFormControl.value){
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
  rejectQualityRedoAction(redoId, responsibleId, noteId, actionIndex, actions): void{
    actions[actionIndex]['status'] = 'Rechazado';
    this.dbs.qualityRedosCollection.doc(redoId).set({actions:actions}, {merge: true});
    this.dbs.usersCollection.doc(responsibleId).collection('tasks').doc(redoId + `${actionIndex}`).update({status: 'Rechazado'});
    this.dbs.usersCollection.doc(responsibleId).collection('notifications').doc(noteId).set({actionStatus: 'Rechazado', actionsList: actions}, {merge: true});
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

}
