import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/core/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-inspection-observation-confirm-save',
  templateUrl: './inspection-observation-confirm-save.component.html',
  styles: []
})
export class InspectionObservationConfirmSaveComponent implements OnInit {

  uploadPercent: Observable<number>;
  mergedForms: any;
  uploading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<InspectionObservationConfirmSaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dbs: DatabaseService,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.mergedForms = Object.assign(this.data[0], this.data[1]);
  }

  save(): void {
    this.uploadFile();
  }

  uploadFile(): void {

    this.uploading = true;

    const filePath = `/securityInspectionsObservationsPictures/${Date.now()}_${this.data[2].name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.data[2]);

    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(res => {
          if (res) {
            let percentNumber = 0;
            let status = 'Por confirmar';
            let estimatedDate = 0;

            let lastObject = {
              initialPicture: res,
              finalPicture: '',
              regDate: Date.now(),
              estimatedTerminationDate: estimatedDate,
              realTerminationDate: estimatedDate,
              percent: percentNumber,
              status: status,
              solved: false,
              source: 'inspection'
            };

            let finalObject = Object.assign(this.mergedForms, lastObject);

            // REGISTERING OBSERVATION IN SECURITY INSPECTIONS ***
            // Adding the observation to the corresponding inspection
            this.dbs.securityInspectionsCollection.doc(this.data[3]).collection(`observations`).add(finalObject)
              .then(refObservation => {
                // Updating the id of the document using the reference
                refObservation.update({ id: refObservation.id })
                  .then(() => {
                    // Constructing the log object
                    let log = {
                      action: 'observation added!',
                      description: this.data[1]['recommendationDescription'],
                      area: this.data[0]['area'],
                      regdate: Date.now()
                    }
                    // Adding the log to the coresponding inspection
                    this.dbs.addInspectionLog(this.data[3], log)
                      .catch(error => {
                        console.log(error);
                        this.uploading = false;
                        this.snackbar.open("Ups!, parece que hubo un error (SI002) ...", "Cerrar", {
                          duration: 6000
                        });
                      });

                  });

                finalObject['id'] = refObservation.id;

                // Adding the observation as task in the tasks collection of responsible supervisor
                this.dbs.usersCollection
                  .doc(this.data[0]['responsibleArea']['supervisor']['uid'])
                  .collection(`tasks`)
                  .doc(refObservation.id)
                  .set(finalObject)
                  .then(() => {

                    // Configuring notification for responsible supervisor
                    let notificationObject = {
                      regDate: Date.now(),
                      id: '',
                      senderId: this.auth.userCRC.uid,
                      senderName: this.auth.userCRC.displayName,
                      areaName: this.data[0]['area']['name'],
                      responsibleAreaName: this.data[0]['responsibleArea']['name'],
                      areaSupervisorId: this.data[0]['responsibleArea']['supervisor']['uid'],
                      areaSupervisorName: this.data[0]['responsibleArea']['supervisor']['displayName'],
                      inspectionId: this.data[0]['inspectionId'],
                      observationId: refObservation.id,
                      subject: this.data[1]['recommendationDescription'],
                      estimatedTerminationDate: 0,
                      taskStatus: 'Por confirmar',
                      status: 'unseen',
                      type: 'inspection observation responsible supervisor'
                    }

                    // Sending notification to responsible supervisor
                    this.dbs.usersCollection
                      .doc(this.data[0]['responsibleArea']['supervisor']['uid'])
                      .collection('notifications')
                      .add(notificationObject)
                      .then(ref => {
                        ref.update({ id: ref.id });
                      })
                      .catch(error => {
                        this.uploading = false;
                        console.log(error);
                        this.snackbar.open("Ups!, parece que hubo un error (SI003) ...", "Cerrar", {
                          duration: 6000
                        });
                      });

                    // Configuring notification for area supervisor
                    let notification2Object = {
                      regDate: Date.now(),
                      id: '',
                      senderId: this.auth.userCRC.uid,
                      senderName: this.auth.userCRC.displayName,
                      areaName: this.data[0]['area']['name'],
                      areaSupervisorId: this.data[0]['area']['supervisor']['uid'],
                      areaSupervisorName: this.data[0]['area']['supervisor']['displayName'],
                      responsibleAreaName: this.data[0]['responsibleArea']['name'],
                      inspectionId: this.data[0]['inspectionId'],
                      observationId: refObservation.id,
                      subject: this.data[1]['recommendationDescription'],
                      estimatedTerminationDate: 0,
                      taskStatus: 'Por confirmar',
                      status: 'unseen',
                      type: 'inspection observation area supervisor'
                    }

                    // Sending notification to area supervisor
                    this.dbs.usersCollection
                      .doc(this.data[0]['area']['supervisor']['uid'])
                      .collection('notifications')
                      .add(notification2Object)
                      .then(ref => {
                        ref.update({ id: ref.id });
                        // Closing the dialog and setting the uploading flag to false
                        this.dialogRef.close(true);
                        this.uploading = false;
                        this.snackbar.open("Listo!", "Cerrar", {
                          duration: 6000
                        });
                      })
                      .catch(error => {
                        this.uploading = false;
                        console.log(error);
                        this.snackbar.open("Ups!, parece que hubo un error (SI003) ...", "Cerrar", {
                          duration: 6000
                        });
                      });

                  });

                // UPDATING INSPECTION TO - IN PROGRESS
                this.dbs.securityInspectionsCollection
                  .doc(this.data[0]['inspectionId'])
                  .update({ status: 'En progreso' })
                  .catch(error => {
                    this.uploading = false;
                    console.log(error);
                    this.snackbar.open("Ups!, parece que hubo un error (SI004) ...", "Cerrar", {
                      duration: 6000
                    });
                  });


              }).catch(err => {
                this.snackbar.open(err, "Cerrar", {
                  duration: 10000
                });
              })
          }
        })
      })
    )
      .subscribe()
  }

}
