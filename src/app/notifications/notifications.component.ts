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
  dateMaintenanceRequestsConfirmationFormControl = new FormControl();
  dateQualitySingleObservationFormControl = new FormControl();
  dateQualityInspectionObservationFormControl = new FormControl();
  dateSsggRequestsConfirmationFormControl = new FormControl();

  constructor(
    public auth: AuthService,
    public dbs: DatabaseService,
    public snackbar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  seen(id): void {
    this.auth.notificationSeen(id);
  }

  unseen(id): void {
    this.auth.notificationUnseen(id);
  }

  deleteNotification(id): void {
    this.auth.notificationsCompleteCollection.doc(id).delete();
  }

  // REJECT AND CONFIRMATION FOR TASK CREATED BY FRED

  reject(fredId, supervisorId, notificationId): void {
    this.dbs.securityFredsCollection.doc(fredId).update({ status: 'Rechazado' });
    this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(fredId).update({ status: 'Rechazado' });
    this.dbs.securityTasksCollection.doc(fredId).update({ status: 'Rechazado' });
    this.auth.notificationsCollection.doc(notificationId).update({ taskStatus: 'Rechazado' });
  }

  confirm(fredId, supervisorId, notificationId): void {
    if (this.dateSecurityInspectionObservationFormControl.value) {
      this.dbs.securityFredsCollection.doc(fredId).update({ status: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf() });
      this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(fredId).update({ status: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf() });
      this.dbs.securityTasksCollection.doc(fredId).update({ status: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf() });
      this.auth.notificationsCollection.doc(notificationId).update({ taskStatus: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf() });
    } else {
      this.snackbar.open("Debe seleccionar una fecha de cumplimiento para poder confirmar la tarea", "Cerrar", {
        duration: 6000
      });
    }
  }

  // REJECT AND CONFIRMATION FOR TASKs CREATED BY OBSERVATIONS ON INSPECTIONS
  rejectSecurityInspectionObservation(inspectionId, observationId, supervisorId, notificationId): void {
    this.dbs.securityInspectionsCollection.doc(inspectionId).collection(`observations`).doc(observationId).update({ status: 'Rechazado' });
    this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(observationId).update({ status: 'Rechazado' });
    this.dbs.securityTasksCollection.doc(observationId).update({ status: 'Rechazado' });
    this.auth.notificationsCollection.doc(notificationId).update({ taskStatus: 'Rechazado' });
  }

  confirmSecurityInspectionObservation(inspectionId, observationId, supervisorId, notificationId): void {
    if (this.dateSecurityInspectionObservationFormControl.value) {
      this.dbs.securityInspectionsCollection.doc(inspectionId).collection(`observations`).doc(observationId).update({ status: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf() });
      this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(observationId).update({ status: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf() });
      this.dbs.securityTasksCollection.doc(observationId).update({ status: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf() });
      this.auth.notificationsCollection.doc(notificationId).update({ taskStatus: 'Confirmado', estimatedTerminationDate: this.dateSecurityInspectionObservationFormControl.value.valueOf() });
    } else {
      this.snackbar.open("Debe seleccionar una fecha de cumplimiento para poder confirmar la tarea", "Cerrar", {
        duration: 6000
      });
    }
  }

  // REJECT AND CONFIRMATION FOR TASKs CREATED BY OBSERVATIONS ON INSPECTIONS
  rejectQualityRedo(redoId, supervisorId, noteId): void {
    this.dbs.qualityRedosCollection.doc(redoId).update({ status: 'Rechazado' });
    this.dbs.usersCollection.doc(supervisorId).collection('notifications').doc(noteId).update({ redoStatus: 'Rechazado' });
  }

  confirmQualityRedo(redoId, supervisorId, noteId): void {
    this.dbs.qualityRedosCollection.doc(redoId).update({ status: 'Confirmado' });
    this.dbs.usersCollection.doc(supervisorId).collection('notifications').doc(noteId).update({ redoStatus: 'Confirmado' });
  }

  // REJECT AND CONFIRMATION FOR TASKs CREATED BY REDOs ACTIONS
  rejectQualityRedoAction(redoId, responsibleId, noteId, taskId): void {
    this.dbs.qualityRedosCollection.doc(redoId).collection('actions').doc(taskId).update({ status: 'Rechazado' });
    this.dbs.usersCollection.doc(responsibleId).collection('tasks').doc(taskId).update({ status: 'Rechazado' });
    this.dbs.usersCollection.doc(responsibleId).collection('notifications').doc(noteId).update({ actionStatus: 'Rechazado' });
  }

  confirmQualityRedoAction(redoId, responsibleId, noteId, taskId): void {
    this.dbs.qualityRedosCollection.doc(redoId).collection('actions').doc(taskId).update({ status: 'Confirmado' });
    this.dbs.usersCollection.doc(responsibleId).collection('tasks').doc(taskId).update({ status: 'Confirmado' });
    this.dbs.usersCollection.doc(responsibleId).collection('notifications').doc(noteId).update({ actionStatus: 'Confirmado' });
  }

  // REJECT AND CONFIRMATION CLOSING REQUEST
  rejectRequestClosing(redoId, noteId, signId): void {
    this.dbs.qualityRedosCollection.doc(redoId).collection('signing').doc(signId).update({ sign: false });
    this.dbs.usersCollection.doc(this.auth.userCRC.uid).collection('notifications').doc(noteId).update({ requestStatus: 'Rechazado' });
  }

  confirmRequestClosing(redoId, noteId, signId): void {
    this.dbs.qualityRedosCollection.doc(redoId).collection('signing').doc(signId).update({ sign: true });
    this.dbs.usersCollection.doc(this.auth.userCRC.uid).collection('notifications').doc(noteId).update({ requestStatus: 'Confirmado' });
  }

  // REJECT AND CONFIRMATION FOR TASKs CREATED BY OBSERVATIONS ON QUALITY INSPECTIONS
  rejectQualityInspectionObservation(inspectionId, observationId, supervisorId, notificationId): void {
    this.dbs.qualityInspectionsCollection.doc(inspectionId).collection(`observations`).doc(observationId).update({ status: 'Rechazado' });
    this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(observationId).update({ status: 'Rechazado' });
    this.dbs.qualityTasksCollection.doc(observationId).update({ status: 'Rechazado' });
    this.auth.notificationsCollection.doc(notificationId).update({ taskStatus: 'Rechazado' });
  }

  confirmQualityInspectionObservation(inspectionId, observationId, supervisorId, notificationId): void {
    if (this.dateQualityInspectionObservationFormControl.value) {
      this.dbs.qualityInspectionsCollection.doc(inspectionId).collection(`observations`).doc(observationId).update({ status: 'Confirmado', estimatedTerminationDate: this.dateQualityInspectionObservationFormControl.value.valueOf() });
      this.dbs.usersCollection.doc(supervisorId).collection(`tasks`).doc(observationId).update({ status: 'Confirmado', estimatedTerminationDate: this.dateQualityInspectionObservationFormControl.value.valueOf() });
      this.dbs.qualityTasksCollection.doc(observationId).update({ status: 'Confirmado', estimatedTerminationDate: this.dateQualityInspectionObservationFormControl.value.valueOf() });
      this.auth.notificationsCollection.doc(notificationId).update({ taskStatus: 'Confirmado', estimatedTerminationDate: this.dateQualityInspectionObservationFormControl.value.valueOf() });
    } else {
      this.snackbar.open("Debe seleccionar una fecha de cumplimiento para poder confirmar la tarea", "Cerrar", {
        duration: 6000
      });
    }
  }

  // REJECT AND CONFIRMATION SINGLE OBSERVATION
  rejectQualitySingleObservation(observationId, notificationId): void {
    this.dbs.qualitySingleObservationsCollection.doc(observationId).update({ status: 'Rechazado' });
    this.auth.notificationsCollection.doc(notificationId).update({ taskStatus: 'Rechazado' });
  }

  confirmQualitySingleObservation(observationId, notificationId): void {
    if (this.dateQualitySingleObservationFormControl.value) {
      this.dbs.qualitySingleObservationsCollection.doc(observationId).update({ status: 'Confirmado', estimatedTerminationDate: this.dateQualitySingleObservationFormControl.value.valueOf() });
      this.auth.notificationsCollection.doc(notificationId).update({ estimatedTerminationDate: this.dateQualitySingleObservationFormControl.value.valueOf() });
    } else {
      this.snackbar.open("Debe seleccionar una fecha de cumplimiento para poder confirmar la solicitud", "Cerrar", {
        duration: 6000
      });
    }
  }

  // REJECT AND CONFIRMATION MAINTENANCE REQUEST
  rejectMaintenanceRequest(requestId, notificationId): void {
    this.dbs.maintenanceRequestsCollection.doc(requestId).set({
      status: 'Rechazado',
      rejectedBy: this.auth.userCRC.displayName,
      uidRejected: this.auth.userCRC.uid
    }, { merge: true });

    let supervisorList = this.dbs.maintenanceSupervisors.slice();
    supervisorList.forEach(user => {
      this.dbs.usersCollection
        .doc(user['uid'])
        .collection('notifications')
        .doc(requestId)
        .set({
          requestStatus: 'Rechazado',
          rejectedBy: this.auth.userCRC.displayName,
          uidRejected: this.auth.userCRC.uid
        }, { merge: true })
    })
  }

  confirmMaintenanceRequest(requestId, notificationId): void {
    if (this.dateMaintenanceRequestsConfirmationFormControl.value) {
      this.dbs.maintenanceRequestsCollection.doc(requestId).set({
        status: 'Confirmado',
        estimatedTerminationDate: this.dateMaintenanceRequestsConfirmationFormControl.value.valueOf(),
        confirmedBy: this.auth.userCRC.displayName,
        uidComfirmed: this.auth.userCRC.uid
      }, { merge: true })

      let supervisorList = this.dbs.maintenanceSupervisors.slice();
      supervisorList.forEach(user => {
        this.dbs.usersCollection
          .doc(user['uid'])
          .collection('notifications')
          .doc(requestId)
          .set({
            requestStatus: 'Confirmado',
            estimatedTerminationDate: this.dateMaintenanceRequestsConfirmationFormControl.value.valueOf(),
            confirmedBy: this.auth.userCRC.displayName,
            uidComfirmed: this.auth.userCRC.uid
          }, { merge: true })
      })
    } else {
      this.snackbar.open("Debe seleccionar una fecha de cumplimiento para poder confirmar la solicitud", "Cerrar", {
        duration: 6000
      });
    }
  }

  // REJECT AND CONFIRMATION FOR SSGG REQUESTS

  rejectSsggRequest(requestId, areaSupervisorId, notificationId): void {
    this.dbs.ssggRequestsCollection.doc(requestId).set({
      status: 'Rechazado',
      rejectedBy: this.auth.userCRC.displayName,
      uidRejected: this.auth.userCRC.uid
    }, { merge: true });

    let supervisorList = this.dbs.ssggSupervisors.slice();
    supervisorList.forEach(user => {
      this.dbs.usersCollection
        .doc(user['uid'])
        .collection('notifications')
        .doc(requestId)
        .set({
          requestStatus: 'Rechazado',
          rejectedBy: this.auth.userCRC.displayName,
          uidRejected: this.auth.userCRC.uid
        }, { merge: true })
    })
    this.dbs.usersCollection.doc(areaSupervisorId).collection(`tasks`).doc(requestId).set({
      status: 'Rechazado',
      rejectedBy: this.auth.userCRC.displayName,
      uidRejected: this.auth.userCRC.uid
    }, { merge: true });
  }

  confirmSsggRequest(requestId, areaSupervisorId, notificationId): void {
    if (this.dateSsggRequestsConfirmationFormControl.value) {
      this.dbs.ssggRequestsCollection.doc(requestId).set({
        status: 'Confirmado',
        estimatedTerminationDate: this.dateSsggRequestsConfirmationFormControl.value.valueOf(),
        confirmedBy: this.auth.userCRC.displayName,
        uidComfirmed: this.auth.userCRC.uid
      }, { merge: true })

      let supervisorList = this.dbs.ssggSupervisors.slice();
      supervisorList.forEach(user => {
        this.dbs.usersCollection
          .doc(user['uid'])
          .collection('notifications')
          .doc(requestId)
          .set({
            requestStatus: 'Confirmado',
            estimatedTerminationDate: this.dateSsggRequestsConfirmationFormControl.value.valueOf(),
            confirmedBy: this.auth.userCRC.displayName,
            uidComfirmed: this.auth.userCRC.uid
          }, { merge: true })
      })
      this.dbs.usersCollection.doc(areaSupervisorId).collection(`tasks`).doc(requestId).set({
        status: 'Confirmado',
        estimatedTerminationDate: this.dateSsggRequestsConfirmationFormControl.value.valueOf(),
        confirmedBy: this.auth.userCRC.displayName,
        uidComfirmed: this.auth.userCRC.uid
      }, { merge: true })
    } else {
      this.snackbar.open("Debe seleccionar una fecha de cumplimiento para poder confirmar la tarea", "Cerrar", {
        duration: 6000
      });
    }
  }

}
