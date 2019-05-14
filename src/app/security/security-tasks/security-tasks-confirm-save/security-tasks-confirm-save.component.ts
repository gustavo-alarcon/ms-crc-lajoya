import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';

@Component({
  selector: 'app-security-tasks-confirm-save',
  templateUrl: './security-tasks-confirm-save.component.html',
  styles: []
})
export class SecurityTasksConfirmSaveComponent implements OnInit {


  uploadPercent_final: Observable<number>;
  uploading_final: boolean = false;
  mergedForms: any;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private storage: AngularFireStorage,
    private dialogRef: MatDialogRef<SecurityTasksConfirmSaveComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  save(): void {
    if (this.data['image']) {
      this.uploading_final = true;

      const filePath = `/securityInspectionsObservationsPictures/${Date.now()}_${this.data['image'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['image']);

      this.uploadPercent_final = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(res => {
            if (res) {
              let finalPicture = res;
              let percentNumber = this.data['form']['percent'];
              let status = ''
              let description = this.data['form']['description'];
              let realDate = 0;
              let solved = false;

              if (this.data['form']['percent'] === 100) {
                solved = true;
                status = 'Finalizado'
                realDate = Date.now();
              }

              let finalObject = {
                finalPicture: finalPicture,
                realTerminationDate: realDate,
                percent: percentNumber,
                status: status,
                solved: solved,
                description: description
              };

              if (this.data['type'] === 'fred') {
                // UPDATING FRED WITH NEW INFO
                this.dbs.securityFredsCollection.doc(this.data['task']['id']).set(finalObject, { merge: true }).then(() => {

                  // Creating log object
                  let log = {
                    action: 'Fred progress saved!',
                    description: finalObject,
                    regdate: Date.now()
                  }
                  // Adding log to respective FRED
                  this.dbs.addFredLog(this.data['task']['id'], log)
                    .then(() => {
                      this.dialogRef.close(true);
                      this.uploading_final = false;
                    })
                    .catch(error => {
                      console.log(error);
                      this.uploading_final = false;
                      this.snackbar.open("Ups!, parece que hubo un error (SF002) ...", "Cerrar", {
                        duration: 6000
                      });
                    });

                  // UPDATING IN STAFF TASKS
                  this.dbs.usersCollection
                    .doc(this.data['task']['observedStaff']['uid'])
                    .collection(`tasks`)
                    .doc(this.data['task']['id'])
                    .set(finalObject, { merge: true })

                  // REGISTRY IN SUPERVISOR TASKS DB AND NOTIFICATIONS DB
                  this.dbs.usersCollection
                    .doc(this.data['task']['observedArea']['supervisor']['uid'])
                    .collection(`tasks`)
                    .doc(this.data['task']['id'])
                    .set(finalObject, { merge: true })

                }).catch(err => {
                  this.snackbar.open(err, "Cerrar", {
                    duration: 10000
                  });
                });
              } else if (this.data['type'] === 'observation') {
                // UPDATING OBSERVATION WITH NEW INFO
                this.dbs.securityInspectionsCollection.doc(this.data['task']['inspectionId']).collection('observations').doc(this.data['task']['id']).set(finalObject, { merge: true }).then(() => {

                  // Creating log object for inspection
                  let log = {
                    action: 'Observation progress saved!',
                    description: finalObject,
                    regdate: Date.now()
                  }
                  log['description.observationId'] = this.data['task']['id'];

                  // Adding log to respective inspection
                  this.dbs.addInspectionLog(this.data['task']['inspectionId'], log)
                    .then(() => {
                      this.dialogRef.close(true);
                      this.uploading_final = false;
                    })
                    .catch(error => {
                      console.log(error);
                      this.uploading_final = false;
                      this.snackbar.open("Ups!, parece que hubo un error (SF002) ...", "Cerrar", {
                        duration: 6000
                      });
                    });

                  // UPDATING IN SUPERVISOR TASKS DB
                  this.dbs.usersCollection
                    .doc(this.data['task']['responsibleArea']['supervisor']['uid'])
                    .collection(`tasks`)
                    .doc(this.data['task']['id'])
                    .set(finalObject, { merge: true })

                }).catch(err => {
                  this.snackbar.open(err, "Cerrar", {
                    duration: 10000
                  });
                });
              }

            }
          })
        })
      )
        .subscribe()

    } else {
      this.uploading_final = true;

      let percentNumber = this.data['form']['percent'];
      let description = this.data['form']['description'];

      let finalObject = {
        percent: percentNumber,
        description: description
      };

      if (this.data['type'] === 'fred') {
        // UPDATING FRED WITH NEW INFO
        this.dbs.securityFredsCollection.doc(this.data['task']['id']).set(finalObject, { merge: true }).then(() => {

          // Creating log object
          let log = {
            action: 'Fred progress saved!',
            description: finalObject,
            regdate: Date.now()
          }
          // Adding log to respective FRED
          this.dbs.addFredLog(this.data['task']['id'], log)
            .then(() => {
              this.dialogRef.close(true);
              this.uploading_final = false;
            })
            .catch(error => {
              console.log(error);
              this.uploading_final = false;
              this.snackbar.open("Ups!, parece que hubo un error (SF002) ...", "Cerrar", {
                duration: 6000
              });
            });

          // UPDATING IN STAFF TASKS
          this.dbs.usersCollection
            .doc(this.data['task']['observedStaff']['uid'])
            .collection(`tasks`)
            .doc(this.data['task']['id'])
            .set(finalObject, { merge: true })

          // REGISTRY IN SUPERVISOR TASKS DB AND NOTIFICATIONS DB
          this.dbs.usersCollection
            .doc(this.data['task']['observedArea']['supervisor']['uid'])
            .collection(`tasks`)
            .doc(this.data['task']['id'])
            .set(finalObject, { merge: true })

        }).catch(err => {
          this.snackbar.open(err, "Cerrar", {
            duration: 10000
          });
        });
      } else if (this.data['type'] === 'observation') {
        // UPDATING OBSERVATION WITH NEW INFO
        this.dbs.securityInspectionsCollection.doc(this.data['task']['inspectionId']).collection('observations').doc(this.data['task']['id']).set(finalObject, { merge: true }).then(() => {

          // Creating log object for inspection
          let log = {
            action: 'Observation progress saved!',
            description: finalObject,
            regdate: Date.now()
          }
          log['description.observatioId'] = this.data['task']['id'];

          // Adding log to respective inspection
          this.dbs.addInspectionLog(this.data['task']['inspectionId'], log)
            .then(() => {
              this.dialogRef.close(true);
              this.uploading_final = false;
            })
            .catch(error => {
              console.log(error);
              this.uploading_final = false;
              this.snackbar.open("Ups!, parece que hubo un error (SF002) ...", "Cerrar", {
                duration: 6000
              });
            });

          // UPDATING IN SUPERVISOR TASKS DB
          this.dbs.usersCollection
            .doc(this.data['task']['area']['supervisor']['uid'])
            .collection(`tasks`)
            .doc(this.data['task']['id'])
            .set(finalObject, { merge: true })

        }).catch(err => {
          this.snackbar.open(err, "Cerrar", {
            duration: 10000
          });
        });
      }
    }
  }

}
