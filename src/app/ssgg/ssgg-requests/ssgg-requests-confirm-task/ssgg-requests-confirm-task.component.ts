import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { DatabaseService } from 'src/app/core/database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { finalize, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-ssgg-requests-confirm-task',
  templateUrl: './ssgg-requests-confirm-task.component.html',
  styles: []
})
export class SsggRequestsConfirmTaskComponent implements OnInit {

  uploadPercent_final1: Observable<number>;
  uploadPercent_final2: Observable<number>;
  uploadPercent_final3: Observable<number>;
  uploadPercent_final4: Observable<number>;
  uploading_final1 = false;
  uploading_final2 = false;
  uploading_final3 = false;
  uploading_final4 = false;

  flag1 = false;
  flag2 = false;
  flag3 = false;
  flag4 = false;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private storage: AngularFireStorage,
    private dialogRef: MatDialogRef<SsggRequestsConfirmTaskComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  save(): void {

    let realDate = 0;

    if (this.data['form']['status'] === 'Finalizado') {
      realDate = Date.now();
    }

    const requestObject = {
      finalPicture1: this.data['request']['finalPicture1'],
      finalPicture2: this.data['request']['finalPicture2'],
      finalPicture3: this.data['request']['finalPicture3'],
      finalPicture4: this.data['request']['finalPicture4'],
      realTerminationDate: realDate,
      status: this.data['form']['status'],
      comments: this.data['form']['comments'],
      percentage: this.data['form']['percentage'],
      editedBy: this.auth.userCRC,
      uidEditor: this.auth.userCRC.uid
    };

    this.dbs.ssggRequestsCollection.doc(this.data['request']['id']).set(requestObject, { merge: true }).then(() => {

      // UPDATING IN REQUESTS DB
      const log = {
        action: 'Request edited!',
        data: requestObject,
        regdate: Date.now()
      }

      this.dbs.addSsggRequestLog(this.data['request']['id'], log)
        .then(() => {
          this.dialogRef.close(true);
        })
        .catch(error => {
          console.log(error);
          this.snackbar.open('Ups!, parece que hubo un error guardando la solicitud...', 'Cerrar', {
            duration: 6000
          });
        });

      this.data['request']['involvedAreas'].forEach(area => {
        // Updating the request task of every supervisor
        this.dbs.usersCollection
          .doc(area['supervisor']['uid'])
          .collection(`tasks`)
          .doc(this.data['request']['id'])
          .set(requestObject, { merge: true });
      });

    }).catch(err => {
      console.log(err);
      this.snackbar.open(err, 'Cerrar', {
        duration: 10000
      });
    });

    if (this.data['finalImage1']) {
      this.uploading_final1 = true;

      const filePath = `/ssggRequestsPictures/${Date.now()}_${this.data['finalImage1'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['finalImage1']);

      this.uploadPercent_final1 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(res => {
            if (res) {

              const newData = {
                finalPicture1: res,
              };

              this.dbs.ssggRequestsCollection.doc(this.data['request']['id']).set(newData, { merge: true })
                .then(() => {
                  this.uploading_final1 = false;
                })
                .catch(err => {
                  console.log(err);
                  this.uploading_final1 = false;
                  this.snackbar.open(err, 'Cerrar', {
                    duration: 10000
                  });
                });
            }
          });
        })
      ).subscribe();
    }

    if (this.data['finalImage2']) {
      this.uploading_final2 = true;

      const filePath = `/ssggRequestsPictures/${Date.now()}_${this.data['finalImage2'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['finalImage2']);

      this.uploadPercent_final2 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(res => {
            if (res) {

              const newData = {
                finalPicture2: res,
              };

              this.dbs.ssggRequestsCollection.doc(this.data['request']['id']).set(newData, { merge: true })
                .then(() => {
                  this.uploading_final2 = false;
                })
                .catch(err => {
                  console.log(err);
                  this.uploading_final2 = false;
                  this.snackbar.open(err, 'Cerrar', {
                    duration: 10000
                  });
                });
            }
          });
        })
      ).subscribe();
    }

    if (this.data['finalImage3']) {
      this.uploading_final3 = true;

      const filePath = `/ssggRequestsPictures/${Date.now()}_${this.data['finalImage3'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['finalImage3']);

      this.uploadPercent_final3 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(res => {
            if (res) {

              const newData = {
                finalPicture3: res,
              };

              this.dbs.ssggRequestsCollection.doc(this.data['request']['id']).set(newData, { merge: true })
                .then(() => {
                  this.uploading_final3 = false;
                })
                .catch(err => {
                  console.log(err);
                  this.uploading_final3 = false;
                  this.snackbar.open(err, 'Cerrar', {
                    duration: 10000
                  });
                });
            }
          });
        })
      ).subscribe();
    }

    if (this.data['finalImage4']) {
      this.uploading_final4 = true;

      const filePath = `/ssggRequestsPictures/${Date.now()}_${this.data['finalImage4'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['finalImage4']);

      this.uploadPercent_final4 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(res => {
            if (res) {

              const newData = {
                finalPicture4: res,
              };

              this.dbs.ssggRequestsCollection.doc(this.data['request']['id']).set(newData, { merge: true })
                .then(() => {
                  this.uploading_final4 = false;
                })
                .catch(err => {
                  console.log(err);
                  this.uploading_final4 = false;
                  this.snackbar.open(err, 'Cerrar', {
                    duration: 10000
                  });
                });
            }
          });
        })
      ).subscribe();
    }

  }

}
