import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/core/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-quality-confirm-add-single-observation',
  templateUrl: './quality-confirm-add-single-observation.component.html',
  styles: []
})
export class QualityConfirmAddSingleObservationComponent implements OnInit {

  uploadPercent: Observable<number>;
  mergedForms: any;
  uploading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<QualityConfirmAddSingleObservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dbs: DatabaseService,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    public auth: AuthService
  ) { }

  ngOnInit() {
  }

  save(): void{

    this.uploading = true;

    const filePath = `/qualityInspectionsSingleObservationsPictures/${Date.now()}_${this.data[2].name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.data[2]);

    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe( res => {
          if(res){
            let status = 'Por confirmar';
            let estimatedDate = 0;

            let finalObject = {
              area: this.data[0]['area'],
              uidSupervisor: this.data[0]['area']['supervisor']['uid'],
              initialPicture: res,
              finalPicture: '',
              regDate: Date.now(),
              estimatedTerminationDate: estimatedDate,
              realTerminationDate: estimatedDate,
              observationDescription: this.data[1]['observationDescription'],
              recommendationDescription: this.data[1]['recommendationDescription'],
              uid: this.auth.userCRC.uid,
              createdBy: this.auth.userCRC,
              status: status,
              solved: false,
              source: 'quality inspection single observation'
            };
            
            // REGISTERING SINGLE OBSERVATION IN DB ***
            // Adding the observation
            this.dbs.qualitySingleObservationsCollection.add(finalObject)
            .then(refObservation => {
              // Updating the id of the document using the reference
              refObservation.update({id: refObservation.id})

              finalObject['id'] = refObservation.id;

              // REGISTERING OBSERVATION IN SUPERVISOR TASKS DB
              // Adding the observation as task in the tasks collection of correspoding supervisor
              this.dbs.usersCollection
                .doc(this.data[0]['area']['supervisor']['uid'])
                .collection(`tasks`)
                .doc(refObservation.id)
                .set(finalObject)
                  .then(() => {
                    
                    // Configuring notification for area supervisor
                    let notificationObject = {
                      regDate: Date.now(),
                      id:'',
                      senderId: this.auth.userCRC.uid,
                      senderName: this.auth.userCRC.displayName,
                      areaId: this.data[0]['area']['id'],
                      areaName: this.data[0]['area']['name'],
                      areaSupervisorId: this.data[0]['area']['supervisor']['uid'],
                      areaSupervisorName: this.data[0]['area']['supervisor']['displayName'],
                      observationId: refObservation.id,
                      subject: this.data[1]['recommendationDescription'],
                      estimatedTerminationDate: 0,
                      taskStatus: 'Por confirmar',
                      status: 'unseen',
                      type: 'quality inspection single observation supervisor'
                    }

                    // Sending notification to area supervisor
                    this.dbs.usersCollection
                    .doc(this.data[0]['area']['supervisor']['uid'])
                    .collection('/notifications')
                    .add(notificationObject)
                      .then(ref => {
                        ref.update({id: ref.id});
                        // Closing the dialog and setting the uploading flag to false
                        this.dialogRef.close(true);
                        this.uploading = false;
                        this.snackbar.open("Listo!","Cerrar",{
                          duration:6000
                        });
                      })
                      .catch(error => {
                        this.uploading = false;
                        console.log(error);
                        this.snackbar.open("Ups!, parece que hubo un error (SI003) ...","Cerrar",{
                          duration:6000
                        });
                      });

                  });
              

            }).catch(err => {
              this.snackbar.open(err,"Cerrar",{
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
