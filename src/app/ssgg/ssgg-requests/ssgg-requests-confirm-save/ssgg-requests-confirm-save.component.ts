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
                finalPicture: '',
                regDate: Date.now(),
                realTerminationDate: 0,
                createdBy: this.auth.userCRC,
                status: 'Por confirmar',
                mainArea: this.data['form']['mainArea'],
                type: this.data['form']['type'],
                priority: this.data['form']['priority'],
                resumen: this.data['form']['resumen'],
                estimatedTerminationDate: this.data['form']['estimatedTerminationDate'].valueOf(),
                involvedAreas: this.data['involvedAreas'],
                coordinations: this.data['form']['coordinations'],
                moreDetails: this.data['form']['moreDetails'],
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
                    .add({
                      regDate: Date.now(),
                      senderId: this.auth.userCRC.uid,
                      senderName: this.auth.userCRC.displayName,
                      areaSupervisorId: area['supervisor']['uid'],
                      areaSupervisorName: area['supervisor']['displayName'],
                      ssggRequestId: refRequest.id,
                      ssggType: this.data['form']['type'],
                      priority: this.data['form']['priority'],
                      resumen: this.data['form']['resumen'],
                      status: 'unseen',
                      type: 'ssgg request'
                    })
                      .then(ref => {
                        ref.update({id: ref.id})
                        this.snackbar.open("Listo!","Cerrar",{
                          duration: 10000
                        });
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
