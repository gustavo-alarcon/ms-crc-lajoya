import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-security-inspection-observation-confirm-delete',
  templateUrl: './security-inspection-observation-confirm-delete.component.html',
  styles: []
})
export class SecurityInspectionObservationConfirmDeleteComponent implements OnInit {

  constructor(
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<SecurityInspectionObservationConfirmDeleteComponent>
  ) { }

  ngOnInit() {
  }

  delete(): void{
    this.dbs.securityInspectionsCollection
      .doc(this.data['id_inspection'])
      .collection(`observations`)
      .doc(this.data['id_observation'])
      .delete()
        .then(() => {
          this.dialogRef.close();
          this.snackbar.open("Listo!","Cerrar",{
            duration: 6000
          })
        })
        .catch(err => {
          console.log(err);
          this.dialogRef.close();
          this.snackbar.open(err,"Cerrar",{
            duration: 6000
          })
        })
  }

}
