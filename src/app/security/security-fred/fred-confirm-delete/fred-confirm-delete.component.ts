import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-fred-confirm-delete',
  templateUrl: './fred-confirm-delete.component.html',
  styles: []
})
export class FredConfirmDeleteComponent implements OnInit {

  constructor(
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<FredConfirmDeleteComponent>
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  delete(): void {
    this.dbs.securityFredsCollection.doc(this.data['id_fred']).delete()
      .catch(err => {
        this.snackbar.open("Ups!...parece que hubo un error", "Cerrar", {
          duration: 6000
        });
        console.log(err);
      });

    
    this.dbs.usersCollection.doc(this.data['id_creator']).collection('tasks').doc(this.data['id_fred']).delete()
      .catch(err => {
        this.snackbar.open("Ups!...parece que hubo un error", "Cerrar", {
          duration: 6000
        });
        console.log(err);
      });

    if(this.data['id_creator'] != this.data['id_staff']){
      this.dbs.usersCollection.doc(this.data['id_staff']).collection('tasks').doc(this.data['id_fred']).delete()
        .catch(err => {
          this.snackbar.open("Ups!...parece que hubo un error", "Cerrar", {
            duration: 6000
          });
          console.log(err);
        });
    }

    if(this.data['id_creator'] != this.data['id_supervisor']){
      this.dbs.usersCollection.doc(this.data['id_supervisor']).collection('tasks').doc(this.data['id_fred']).delete()
        .catch(err => {
          this.snackbar.open("Ups!...parece que hubo un error", "Cerrar", {
            duration: 6000
          });
          console.log(err);
        });
    }

    this.snackbar.open("Listo!", "Cerrar", {
      duration: 6000
    });

    this.dialogRef.close();

  }
}
