import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-quality-inspection-confirm-delete',
  templateUrl: './quality-inspection-confirm-delete.component.html',
  styles: []
})
export class QualityInspectionConfirmDeleteComponent implements OnInit {

  constructor(
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<QualityInspectionConfirmDeleteComponent>
  ) { }

  ngOnInit() {
  }

  delete(): void {
    this.dbs.qualityInspectionsCollection
      .doc(this.data['id_inspection'])
      .collection('observations').get().forEach(snapshot => {

        snapshot.docs.forEach(doc => {
          let observation = doc.data();
          this.dbs.usersCollection
            .doc(observation['area']['supervisor']['uid'])
            .collection('tasks')
            .doc(observation['id'])
            .delete()

        });

        this.dbs.qualityInspectionsCollection.doc(this.data['id_inspection']).delete()
          .then(() => {
            this.snackbar.open("Listo!", "Cerrar", {
              duration: 6000
            });
          })
          .catch(err => {
            this.snackbar.open("Ups!...parece que hubo un error", "Cerrar", {
              duration: 6000
            });
            console.log(err);
          });

        this.dialogRef.close();

      })

  }

}
