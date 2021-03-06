import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/core/auth.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-ssgg-requests-confirm-save',
  templateUrl: './ssgg-requests-confirm-save.component.html',
  styles: []
})
export class SsggRequestsConfirmSaveComponent implements OnInit {

  uploadPercent: Observable<number>;
  uploading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SsggRequestsConfirmSaveComponent>,
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

      const filePath = `/ssggRequestsPictures/${this.data['image'].name}`;
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
                finalPicture1: '',
                finalPicture2: '',
                finalPicture3: '',
                finalPicture4: '',
                regDate: Date.now(),
                realTerminationDate: 0,
                createdBy: this.auth.userCRC,
                status: 'Por confirmar',
                percentage: 0,
                mainArea: this.data['form']['mainArea'],
                type: this.data['form']['type'],
                priority: this.data['form']['priority'],
                resumen: this.data['form']['resumen'],
                estimatedTerminationDate: this.data['form']['estimatedTerminationDate'].valueOf(),
                involvedAreas: this.data['involvedAreas'],
                coordinations: this.data['form']['coordinations'],
                comments: '',
                source: 'ssgg',
                uid: this.auth.userCRC.uid
              };

              this.dbs.ssggRequestsCollection.add(requestObject).then(refRequest => {

                // REGISTRY IN REQUESTS DB
                refRequest.update({id: refRequest.id}).then(() => {
                  let log = {
                    action: 'Request created!',
                    data: requestObject,
                    regdate: Date.now()
                  }

                  this.dbs.addSsggRequestLog(refRequest.id, log)
                    .then(() => {
                      this.dialogRef.close(true);
                      this.uploading = false;
                      this.snackbar.open("Listo!...Enviando notificaciones","Cerrar", {
                        duration:6000
                      })
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

                this.data['involvedAreas'].forEach(area => {
                  // Adding the request to task and notifications of every supervisor
                  this.dbs.usersCollection
                    .doc(area['supervisor']['uid'])
                    .collection(`tasks`)
                    .doc(refRequest.id)
                    .set(requestObject)

                  this.dbs.usersCollection
                    .doc(area['supervisor']['uid'])
                    .collection(`notifications`)
                    .doc(refRequest.id)
                    .set({
                      id:refRequest.id,
                      regDate: Date.now(),
                      senderId: this.auth.userCRC.uid,
                      senderName: this.auth.userCRC.displayName,
                      areaSupervisorId: area['supervisor']['uid'],
                      areaSupervisorName: area['supervisor']['displayName'],
                      ssggRequestId: refRequest.id,
                      ssggType: this.data['form']['type'],
                      priority: this.data['form']['priority'],
                      resumen: this.data['form']['resumen'],
                      requestStatus: 'Por confirmar',
                      status: 'unseen',
                      type: 'ssgg request'
                    })
                  });

                // sending notifications to ssgg supervisors
                this.dbs.ssggSupervisors.forEach(user => {
                  this.dbs.usersCollection
                    .doc(user['uid'])
                    .collection(`notifications`)
                    .doc(refRequest.id)
                    .set({
                      id:refRequest.id,
                      regDate: Date.now(),
                      senderId: this.auth.userCRC.uid,
                      senderName: this.auth.userCRC.displayName,
                      areaSupervisorId: user['uid'],
                      areaSupervisorName: user['displayName'],
                      ssggRequestId: refRequest.id,
                      ssggType: this.data['form']['type'],
                      priority: this.data['form']['priority'],
                      resumen: this.data['form']['resumen'],
                      requestStatus: 'Por confirmar',
                      status: 'unseen',
                      type: 'ssgg request ssgg supervisor'
                    })
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
