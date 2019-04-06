import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-quality-redos-actions-confirm-resend',
  templateUrl: './quality-redos-actions-confirm-resend.component.html',
  styles: []
})
export class QualityRedosActionsConfirmResendComponent implements OnInit {

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<QualityRedosActionsConfirmResendComponent>
  ) { }

  ngOnInit() {
  }

  save(): void{
    // adding notification to users
    this.dbs.usersCollection
    .doc(this.data['user']['uid'])
    .collection('notifications')
    .add({
      regDate: Date.now(),
      senderId: this.auth.userCRC.uid,
      senderName: this.auth.userCRC.displayName,
      redoId: this.data['redo']['id'],
      signId: this.data['user']['uid'],
      component: this.data['redo']['component'],
      OT: this.data['redo']['OT'],
      description: this.data['redo']['description'],
      requestStatus: 'Por confirmar',
      status: 'unseen',
      type: 'quality redo actions request closing'
    })
    .then(ref => {
      ref.update({id: ref.id});
      this.dialogRef.close(true);
    })
    .catch(error => {
      console.log(error);
      this.snackbar.open("Ups!, parece que hubo un error enviando la solicitud ...","Cerrar",{
        duration:6000
      });
    });
  }

}
