import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/core/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-quality-tasks-confirm-finalize-inspection',
  templateUrl: './quality-tasks-confirm-finalize-inspection.component.html',
  styles: []
})
export class QualityTasksConfirmFinalizeInspectionComponent implements OnInit {

  uploadPercent_1: Observable<number>;
  uploading_1: boolean = false;

  processStep: string = 'Completando información';

  now: number = Date.now();

  constructor(
    public dialogRef: MatDialogRef<QualityTasksConfirmFinalizeInspectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dbs: DatabaseService,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    public auth: AuthService
  ) { }

  ngOnInit() {
  }

  save(): void {

    this.processStep = "Cargando imágen";

    this.dbs.qualityTasksCollection.doc(this.data['task']['id']).set({ details: this.data['details'], status: 'Finalizado', realTerminationDate: this.now }, { merge: true });

    this.dbs.qualityInspectionsCollection.doc(this.data['task']['inspectionId'])
      .collection('observations')
      .doc(this.data['task']['id'])
      .set({ details: this.data['details'], status: 'Finalizado', realTerminationDate: this.now }, { merge: true });

    if (this.data['img1']) {
      this.uploading_1 = true;

      const filePath = `/qualityTasksInspectionsPictures/${Date.now()}_${this.data['img1'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['img1']);

      this.uploadPercent_1 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(res => {
            if (res) {
              this.processStep = "...Actualizando tarea";
              this.dbs.qualityTasksCollection.doc(this.data['task']['id']).set({ finalPicture: res }, { merge: true })
                .then(() => {
                  this.processStep = "...Actualizando observación en inspección";
                  this.dbs.qualityInspectionsCollection.doc(this.data['task']['inspectionId'])
                    .collection('observations')
                    .doc(this.data['task']['id'])
                    .set({ finalPicture: res }, { merge: true })
                    .then(() => {
                      this.processStep = "...Listo!";
                      this.dialogRef.close(true);
                    });
                })
                .catch(err => {
                  this.dialogRef.close(true);
                  console.log(err);
                  this.snackbar.open(err, "Cerrar", {
                    duration: 10000
                  });
                })

            }
          })
        })
      ).subscribe()
    }
  }
}
