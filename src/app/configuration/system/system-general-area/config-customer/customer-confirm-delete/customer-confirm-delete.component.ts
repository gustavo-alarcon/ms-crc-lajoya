import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-customer-confirm-delete',
  templateUrl: './customer-confirm-delete.component.html',
  styles: []
})
export class CustomerConfirmDeleteComponent implements OnInit {

  uploading: boolean = false;

  constructor(
    public dbs: DatabaseService,
    public dialogRef: MatDialogRef<CustomerConfirmDeleteComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  delete(): void{
    this.dbs.usersCollection
        .doc(this.data['id'])
        .delete()
          .then(() => {
            this.uploading = false;
            this.snackbar.open("Listo!...Cliente borrado","Cerrar",{
              duration: 6000
            });
            this.dialogRef.close(true);
          })
          .catch(err => {
            this.uploading = false;
            console.log(err);
            this.snackbar.open("Ups..Parece que hubo un error borrando el cliente","Cerrar",{
              duration: 6000
            });
          })
  }

}
