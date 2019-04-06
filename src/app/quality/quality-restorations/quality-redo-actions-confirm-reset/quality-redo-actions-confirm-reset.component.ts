import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-quality-redo-actions-confirm-reset',
  templateUrl: './quality-redo-actions-confirm-reset.component.html',
  styles: []
})
export class QualityRedoActionsConfirmResetComponent implements OnInit {

  uploading: boolean = false;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialogRef: MatDialogRef<QualityRedoActionsConfirmResetComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  save(): void{
    this.uploading = true;

    // updating values in REDO document
    this.dbs.qualityRedosCollection.doc(this.data['redo']['id']).collection('actions').doc(this.data['task']['id']).set({valid: false, status: 'Confirmado'}, {merge:true})
      .then(() => {
        this.dialogRef.close(true);
        this.uploading = false;
        this.snackbar.open("Listo!", "Cerrar", {
          duration: 6000
        });
      })
      .catch(error => {
        console.log(error);
        this.uploading = false;
        this.snackbar.open("Ups!, parece que hubo un error actualizando el documento principal...","Cerrar",{
          duration:6000
        });
      });

    // Creating log object
    let log = {
      action: 'Action restaured!',
      user: this.auth.userCRC,
      regdate: Date.now()
    }
    
    // Adding log to redo
    this.dbs.addQualityRedoLog(this.data['redo']['id'], log)
      .catch(error => {
        console.log(error);
        this.uploading = false;
        this.snackbar.open("Ups!, parece que hubo un error agregando el log...","Cerrar",{
          duration:6000
        });
      });
    
    // Updating values in responsible tasks
    this.dbs.usersCollection
      .doc(this.data['task']['actionResponsible']['uid'])
      .collection('tasks')
      .doc(this.data['task']['id'])
      .set({valid: false, status: 'Confirmado'}, {merge:true})
      .catch(error => {
        console.log(error);
        this.uploading = false;
        this.snackbar.open("Ups!, parece que hubo un error actualizando al responsable ...","Cerrar",{
          duration:6000
        });
      });

    // send notification to responsible
    this.dbs.usersCollection
      .doc(this.data['task']['actionResponsible']['uid'])
      .collection('notifications')
      .add({
        regDate: Date.now(),
        senderId: this.auth.userCRC.uid,
        senderName: this.auth.userCRC.displayName,
        redoId: this.data['redo']['id'],
        component: this.data['redo']['component'],
        OT: this.data['redo']['OT'],
        description: this.data['redo']['description'],
        actionStatus: 'Confirmado',
        status: 'unseen',
        type: 'quality redo actions task restaured'
      })
      .then(ref => {
        ref.update({id: ref.id})
      })
      .catch(error => {
        console.log(error);
        this.uploading = false;
        this.snackbar.open("Ups!, parece que hubo un error enviando la notificación al responsable de la tarea...","Cerrar",{
          duration:6000
        });
      });

    this.data['task']['additionalStaff'].forEach(element => {
      // Updating values in responsible tasks
      this.dbs.usersCollection
        .doc(element['uid'])
        .collection('tasks')
        .doc(this.data['task']['id'])
        .set({valid: false, status: 'Confirmado'}, {merge:true})
        .catch(error => {
          console.log(error);
          this.uploading = false;
          this.snackbar.open("Ups!, parece que hubo un error actualizando al personal adicional...","Cerrar",{
            duration:6000
          });
        });
    });
  }

}
