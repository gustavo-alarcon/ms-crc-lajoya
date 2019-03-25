import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-quality-redo-report-confirm-delete',
  templateUrl: './quality-redo-report-confirm-delete.component.html',
  styles: []
})
export class QualityRedoReportConfirmDeleteComponent implements OnInit {

  constructor(
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<QualityRedoReportConfirmDeleteComponent>
  ) { }

  ngOnInit() {
  }

  delete(): void {
    this.dbs.qualityRedosCollection.doc(this.data['reportId']).delete()
      .catch(err => {
        this.snackbar.open("Ups!...parece que hubo un error", "Cerrar", {
          duration: 6000
        });
        console.log(err);
      });

    
    this.dbs.usersCollection.doc(this.data['supervisorId']).collection('tasks').doc(this.data['reportId']).delete()
      .catch(err => {
        this.snackbar.open("Ups!...parece que hubo un error", "Cerrar", {
          duration: 6000
        });
        console.log(err);
      });

    this.snackbar.open("Listo!", "Cerrar", {
      duration: 6000
    });

    this.dialogRef.close();

  }


}
