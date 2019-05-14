import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-quality-inspection-observation-confirm-delete',
  templateUrl: './quality-inspection-observation-confirm-delete.component.html',
  styles: []
})
export class QualityInspectionObservationConfirmDeleteComponent implements OnInit {

  loading: boolean = false;

  constructor(
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<QualityInspectionObservationConfirmDeleteComponent>
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  delete(): void{
    this.loading = true;
    this.dbs.qualityInspectionsCollection
      .doc(this.data['id_inspection'])
      .collection(`observations`)
      .doc(this.data['id_observation'])
      .delete()
        .then(() => {
          // So, what next ?
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.dialogRef.close();
          this.snackbar.open(err,"Cerrar",{
            duration: 6000
          })
        })

    this.dbs.usersCollection
      .doc(this.data['id_supervisor'])
      .collection('tasks')
      .doc(this.data['id_observation'])
      .delete()
        .then(() => {
          this.loading = false;
          this.dialogRef.close(true);
          this.snackbar.open("Listo!","Cerrar",{
            duration: 6000
          })
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.dialogRef.close(true);
          this.snackbar.open(err,"Cerrar",{
            duration: 6000
          })
        })
  }

}
