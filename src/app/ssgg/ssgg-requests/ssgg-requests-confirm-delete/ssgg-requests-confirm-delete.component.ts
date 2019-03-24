import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-ssgg-requests-confirm-delete',
  templateUrl: './ssgg-requests-confirm-delete.component.html',
  styles: []
})
export class SsggRequestsConfirmDeleteComponent implements OnInit {

  constructor(
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<SsggRequestsConfirmDeleteComponent>
  ) { }

  ngOnInit() {
  }

  delete(): void {
    this.dbs.ssggRequestsCollection.doc(this.data['id_request']).delete()
      .catch(err => {
        this.snackbar.open("Ups!...parece que hubo un error", "Cerrar", {
          duration: 6000
        });
        console.log(err);
      });

    this.data['involvedAreas'].forEach(area => {
      this.dbs.usersCollection.doc(area['supervisor']['uid']).collection('tasks').doc(this.data['id_request']).delete()
      .catch(err => {
        this.snackbar.open("Ups!...parece que hubo un error", "Cerrar", {
          duration: 6000
        });
        console.log(err);
      });
    });
    

    this.snackbar.open("Listo!", "Cerrar", {
      duration: 6000
    });

    this.dialogRef.close();

  }
}
