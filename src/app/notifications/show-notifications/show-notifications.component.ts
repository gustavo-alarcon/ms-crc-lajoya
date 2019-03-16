import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-show-notifications',
  templateUrl: './show-notifications.component.html',
  styles: []
})
export class ShowNotificationsComponent implements OnInit {

  dateFormControl = new FormControl();

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<ShowNotificationsComponent>
  ) {
  }

  ngOnInit() {
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
