import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-maintenance-requests-confirm-delete',
  templateUrl: './maintenance-requests-confirm-delete.component.html',
  styles: []
})
export class MaintenanceRequestsConfirmDeleteComponent implements OnInit {

  constructor(
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<MaintenanceRequestsConfirmDeleteComponent>
  ) { }

  ngOnInit() {
  }

  delete(): void {
    this.dbs.maintenanceRequestsCollection.doc(this.data['id_request']).delete()
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
