import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/core/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-maintenance-requests-confirm-save',
  templateUrl: './maintenance-requests-confirm-save.component.html',
  styles: []
})
export class MaintenanceRequestsConfirmSaveComponent implements OnInit {

  uploadPercent: Observable<number>;
  mergedForms: any;
  uploading: boolean = false;
  observations: Array<any> = [];

  constructor(
    public dialogRef: MatDialogRef<MaintenanceRequestsConfirmSaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dbs: DatabaseService,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    public auth: AuthService
  ) { }

  ngOnInit() {
  }

  save(): void{

    if(this.data['image']){
      this.uploading = true;

      const filePath = `/securityFredsPictures/${this.data['image'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['image']);

      this.uploadPercent = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){

              let requestObject = {
                id:'',
                initialPicture: res,
                finalPicture: '',
                regDate: Date.now(),
                estimatedTerminationDate: 0,
                realTerminationDate: 0,
                createdBy: this.auth.userCRC,
                status: 'Por confirmar',
                observation: this.data['form']['observation'],
                area: this.data['form']['area'],
                priority: "Por asignar",
                equipment: this.data['form']['equipment'],
                source: 'maintenance',
                uid: this.auth.userCRC.uid
              };
      
              this.dbs.maintenanceRequestsCollection.add(requestObject).then(refRequest => {

                // REGISTRY IN REQUESTS DB
                refRequest.update({id: refRequest.id}).then(() => {
                  let log = {
                    action: 'Request created!',
                    data: requestObject,
                    regdate: Date.now()
                  }

                  this.dbs.addMaintenanceRequestLog(refRequest.id, log)
                    .then(() => {
                      this.dialogRef.close(true);
                      this.uploading = false;
                    })
                    .catch(error => {
                      console.log(error);
                      this.uploading = false;
                      this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                        duration:6000
                      });
                    });
                });

                requestObject['id'] = refRequest.id;

                // Sending notifications to maintenance supervisors
                this.dbs.maintenanceSupervisors.forEach(user => {

                  this.dbs.usersCollection
                  .doc(user['uid'])
                  .collection(`notifications`)
                  .doc(refRequest.id)
                  .set({
                    id: refRequest.id,
                    regDate: Date.now(),
                    estimatedTerminationDate: 0,
                    senderId: this.auth.userCRC.uid,
                    senderName: this.auth.userCRC.displayName,
                    maintenanceRequestId: refRequest.id,
                    equipment: this.data['form']['equipment'],
                    requestId: refRequest.id,
                    requestStatus: "Por confirmar",
                    observation: this.data['form']['observation'],
                    status: 'unseen',
                    type: 'maintenance request supervisor'
                  })
                })
                
                // Sending notifications to broadcast list
                this.dbs.maintenanceBroadcastList.forEach(user => {
                  this.dbs.usersCollection
                  .doc(user['uid'])
                  .collection(`notifications`)
                  .doc(refRequest.id)
                  .set({
                    id: refRequest.id,
                    regDate: Date.now(),
                    senderId: this.auth.userCRC.uid,
                    senderName: this.auth.userCRC.displayName,
                    maintenanceRequestId: refRequest.id,
                    equipment: this.data['form']['equipment'],
                    requestId:refRequest.id,
                    requestStatus: "Por confirmar",
                    observation: this.data['form']['observation'],
                    status: 'unseen',
                    type: 'maintenance request broadcast'
                  })
                })
                

              }).catch(err => {
                console.error(err);
                this.snackbar.open(err,"Cerrar",{
                  duration: 10000
                });
              });

            }
          })
        })
      )
      .subscribe()
    }

  }

}
