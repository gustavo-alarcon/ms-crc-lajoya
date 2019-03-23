import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ssgg-requests-confirm-edit',
  templateUrl: './ssgg-requests-confirm-edit.component.html',
  styles: []
})
export class SsggRequestsConfirmEditComponent implements OnInit {

  uploadPercent_initial: Observable<number>;
  uploading_initial: boolean = false;
  uploadPercent_final: Observable<number>;
  uploading_final: boolean = false;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private storage: AngularFireStorage,
    private dialogRef: MatDialogRef<SsggRequestsConfirmEditComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  save(): void{

    if(this.data['initialImage']){
      this.uploading_initial = true;

      const filePath = `/ssggRequestsPictures/${this.data['initialImage'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['initialImage']);

      this.uploadPercent_initial = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){
              let realDate = 0;

              if(this.data['form']['status'] === 'Finalizado'){
                realDate = Date.now();
              }

              let requestObject = {
                initialPicture: res,
                realTerminationDate: realDate,
                status: this.data['form']['status'],
                mainArea: this.data['form']['mainArea'],
                type: this.data['form']['type'],
                priority: this.data['form']['priority'],
                resumen: this.data['form']['resumen'],
                involvedAreas: this.data['involvedAreas'],
                coordinations: this.data['form']['coordinations'],
                moreDetails: this.data['form']['moreDetails'],
                comments: '',
                source: 'maintenance',
                modifiedBy: this.auth.userCRC,
                uidEditor: this.auth.userCRC.uid
              };
      
              this.dbs.ssggRequestsCollection.doc(this.data['requestId']).set(requestObject, {merge: true}).then(refRequest => {

                // UPDATING IN REQUESTS DB
                let log = {
                  action: 'Request edited!',
                  data: requestObject,
                  regdate: Date.now()
                }

                this.dbs.addSsggRequestLog(this.data['requestId'], log)
                  .then(() => {
                    this.dialogRef.close(true);
                    this.uploading_initial = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_final = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                this.data['involvedAreas'].forEach(area => {
                  // Updating the request task of every supervisor
                  this.dbs.usersCollection
                  .doc(area['supervisor']['uid'])
                  .collection(`tasks`)
                  .doc(this.data['requestId'])
                  .set(requestObject, {merge: true})
                });
                

              }).catch(err => {
                console.log(err);
                this.snackbar.open(err,"Cerrar",{
                  duration: 10000
                });
              });
            }
          })
        })
      )
      .subscribe()
    }else{
      let realDate = 0;

      if(this.data['form']['status'] === 'Finalizado'){
        realDate = Date.now();
      }

      let requestObject = {
        realTerminationDate: realDate,
        status: this.data['form']['status'],
        mainArea: this.data['form']['mainArea'],
        type: this.data['form']['type'],
        priority: this.data['form']['priority'],
        resumen: this.data['form']['resumen'],
        involvedAreas: this.data['involvedAreas'],
        coordinations: this.data['form']['coordinations'],
        moreDetails: this.data['form']['moreDetails'],
        comments: '',
        source: 'maintenance',
        modifiedBy: this.auth.userCRC,
        uidEditor: this.auth.userCRC.uid
      };

      this.dbs.ssggRequestsCollection.doc(this.data['requestId']).set(requestObject, {merge: true}).then(() => {

        // UPDATING IN REQUESTS DB
        let log = {
          action: 'Request created!',
          data: requestObject,
          regdate: Date.now()
        }

        this.dbs.addSsggRequestLog(this.data['requestId'], log)
          .then(() => {
            this.dialogRef.close(true);
            this.uploading_initial = false;
          })
          .catch(error => {
            console.log(error);
            this.uploading_final = false;
            this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
              duration:6000
            });
          });

          this.data['involvedAreas'].forEach(area => {
            // Updating the request task of every supervisor
            this.dbs.usersCollection
            .doc(area['supervisor']['uid'])
            .collection(`tasks`)
            .doc(this.data['requestId'])
            .set(requestObject, {merge: true})
          });

      }).catch(err => {
        console.log(err);
        this.snackbar.open(err,"Cerrar",{
          duration: 10000
        });
      });
    }

    if(this.data['finalImage']){
      this.uploading_final = true;

      const filePath = `/ssggRequestsPictures/${this.data['finalImage'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['finalImage']);

      this.uploadPercent_final = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){

              let requestObject = {
                finalPicture: res
              };
      
              this.dbs.ssggRequestsCollection.doc(this.data['requestId']).set(requestObject, {merge: true}).then(refRequest => {

                // UPDATING IN REQUESTS DB
                let log = {
                  action: 'Request edited!',
                  data: requestObject,
                  regdate: Date.now()
                }

                this.dbs.addSsggRequestLog(this.data['requestId'], log)
                  .then(() => {
                    this.dialogRef.close(true);
                    this.uploading_initial = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_final = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                  this.data['involvedAreas'].forEach(area => {
                    // Updating the request task of every supervisor
                    this.dbs.usersCollection
                    .doc(area['supervisor']['uid'])
                    .collection(`tasks`)
                    .doc(this.data['requestId'])
                    .set(requestObject, {merge: true})
                  });

              }).catch(err => {
                console.log(err);
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
