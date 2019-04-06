import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-quality-redo-actions-confirm-delete-action',
  templateUrl: './quality-redo-actions-confirm-delete-action.component.html',
  styles: []
})
export class QualityRedoActionsConfirmDeleteActionComponent implements OnInit {

  uploading: boolean = false;
  
  reportObject: object;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialogRef: MatDialogRef<QualityRedoActionsConfirmDeleteActionComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  save(): void{

    this.uploading = true;

    this.dbs.qualityRedosCollection.doc(this.data['redo']['id']).collection('actions').doc(this.data['action']['id']).delete();

    // Creating log object
    let log = {
      action: 'Deleting action!',
      data: this.data['action'],
      user: this.auth.userCRC,
      regdate: Date.now()
    }
    
    // Adding log to redo
    this.dbs.addQualityRedoLog(this.data['redo']['id'], log)
      .then(() => {
        this.dialogRef.close('Acciones');
        this.uploading = false;
      })
      .catch(error => {
        console.log(error);
        this.uploading = false;
        this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
          duration:6000
        });
      });

    // deleting task from responsible
    this.dbs.usersCollection
      .doc(this.data['action']['actionResponsible']['uid'])
      .collection(`tasks`)
      .doc(this.data['action']['id'])
      .delete()
    
    // deleting task from additional staff
    this.data['action']['additionalStaff'].forEach(element => {
      this.dbs.usersCollection
        .doc(element['uid'])
        .collection(`tasks`)
        .doc(this.data['action']['id'])
        .delete()
    });
    
  }


}
