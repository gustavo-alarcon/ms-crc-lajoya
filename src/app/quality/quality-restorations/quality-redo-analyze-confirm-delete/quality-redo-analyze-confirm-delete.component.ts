import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-quality-redo-analyze-confirm-delete',
  templateUrl: './quality-redo-analyze-confirm-delete.component.html',
  styles: []
})
export class QualityRedoAnalyzeConfirmDeleteComponent implements OnInit {

  constructor(
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<QualityRedoAnalyzeConfirmDeleteComponent>
  ) { }

  ngOnInit() {
  }

  delete(): void {
    this.dbs.qualityRedosCollection.doc(this.data['id']).delete()
      .catch(err => {
        this.snackbar.open("Ups!...parece que hubo un error", "Cerrar", {
          duration: 6000
        });
        console.log(err);
      });

    
    this.dbs.usersCollection.doc(this.data['uidSupervisor']).collection('tasks').doc(this.data['id']).delete()
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
