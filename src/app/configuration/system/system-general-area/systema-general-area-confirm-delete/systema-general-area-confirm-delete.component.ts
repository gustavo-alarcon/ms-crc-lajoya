import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-systema-general-area-confirm-delete',
  templateUrl: './systema-general-area-confirm-delete.component.html',
  styles: []
})
export class SystemaGeneralAreaConfirmDeleteComponent implements OnInit {

  deleting: boolean = false;

  constructor(
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SystemaGeneralAreaConfirmDeleteComponent>
  ) { }

  ngOnInit() {
  }

  delete(): void{
    this.deleting = true;

    this.dbs.areasCollection
    .doc(this.data['id'])
    .delete()
      .then(() => {
        this.deleting = false;
        this.snackbar.open("Listo!","Cerrar",{
          duration: 6000
        });
        this.dialogRef.close();
      })
      .catch(err => {
        console.log(err);
        this.snackbar.open("Ups!...Parece que hubo error borrando el área","Cerrar",{
          duration: 6000
        });
        this.deleting = false;
      })
  }

}
