import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-quality-inspection-confirm-termination',
  templateUrl: './quality-inspection-confirm-termination.component.html',
  styles: []
})
export class QualityInspectionConfirmTerminationComponent implements OnInit {

  now = new Date();

  constructor(
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<QualityInspectionConfirmTerminationComponent>
  ) { }

  ngOnInit() {
  }

  terminate(): void{
    this.dbs.qualityInspectionsCollection
      .doc(this.data['id_inspection'])
      .update({status: 'Finalizado', realTerminationDate: this.now.valueOf()})
        .then(() => {
          this.snackbar.open("Listo!", "Cerrar", {
            duration: 6000
          });
          this.dialogRef.close();
        })
        .catch(err => {
          console.log(err);
          this.snackbar.open(err, "Cerrar", {
            duration: 6000
          })
        })
  }

}
