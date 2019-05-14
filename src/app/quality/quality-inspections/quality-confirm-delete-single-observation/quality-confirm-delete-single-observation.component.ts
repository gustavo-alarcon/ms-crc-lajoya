import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-quality-confirm-delete-single-observation',
  templateUrl: './quality-confirm-delete-single-observation.component.html',
  styles: []
})
export class QualityConfirmDeleteSingleObservationComponent implements OnInit {

  loading: boolean = false;

  constructor(
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<QualityConfirmDeleteSingleObservationComponent>
  ) { }

  ngOnInit() {
  }

  delete(): void{
    this.loading = true;

    this.dbs.qualitySingleObservationsCollection
      .doc(this.data['id_observation'])
      .delete()
        .then(() => {
          // What to do ?
        })
        .catch(err => {
          console.log(err);
          this.dialogRef.close(true);
          this.snackbar.open(err,"Cerrar",{
            duration: 6000
          })
          this.loading = false;
        })

    this.dbs.usersCollection
      .doc(this.data['id_supervisor'])
      .collection('tasks')
      .doc(this.data['id_observation'])
      .delete()
        .then(() => {
          this.dialogRef.close(true);
          this.snackbar.open("Listo!","Cerrar",{
            duration: 6000
          })
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.dialogRef.close(true);
          this.snackbar.open(err,"Cerrar",{
            duration: 6000
          });
          this.loading = false;
        })
  }

}
