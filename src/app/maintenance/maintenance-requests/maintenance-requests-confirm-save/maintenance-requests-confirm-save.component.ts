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
                realTerminationDate: 0,
                createdBy: this.auth.userCRC,
                status: 'Por confirmar',
                observation: this.data['form']['observation'],
                area: this.data['form']['area'],
                priority: this.data['form']['priority'],
                equipment: this.data['form']['equipment'],
                source: 'maintenance',
                uid: this.auth.userCRC.uid,
                uidSupervisor: this.data['form']['area']['supervisor']['uid']
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

                // REGISTRY IN AREA SUPERVISOR TASKS DB AND NOTIFICATIONS DB
                this.dbs.usersCollection
                  .doc(this.data['form']['area']['supervisor']['uid'])
                  .collection(`tasks`)
                  .doc(refRequest.id)
                  .set(requestObject)

                this.dbs.usersCollection
                  .doc(this.data['form']['area']['supervisor']['uid'])
                  .collection(`notifications`)
                  .add({
                    regDate: Date.now(),
                    senderId: this.auth.userCRC.uid,
                    senderName: this.auth.userCRC.displayName,
                    areaSupervisorId: this.data['form']['area']['supervisor']['uid'],
                    areaSupervisorName: this.data['form']['area']['supervisor']['displayName'],
                    maintenanceRequestId: refRequest.id,
                    equipment: this.data['form']['equipment'],
                    priority: this.data['form']['priority'],
                    observation: this.data['form']['observation'],
                    status: 'unseen',
                    type: 'maintenance request'
                  })
                    .then(ref => {
                      ref.update({id: ref.id})
                      this.snackbar.open("Listo!","Cerrar",{
                        duration: 10000
                      });
                    });

              }).catch(err => {
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
