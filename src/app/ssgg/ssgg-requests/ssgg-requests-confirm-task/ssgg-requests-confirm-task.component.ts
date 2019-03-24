import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { DatabaseService } from 'src/app/core/database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ssgg-requests-confirm-task',
  templateUrl: './ssgg-requests-confirm-task.component.html',
  styles: []
})
export class SsggRequestsConfirmTaskComponent implements OnInit {

  uploadPercent_final: Observable<number>;
  uploading_final: boolean = false;

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

  save(): void{

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
              let realDate = 0;

              if(this.data['form']['status'] === 'Finalizado'){
                realDate = Date.now();
              }

              let requestObject = {
                finalPicture: res,
                realTerminationDate: realDate,
                status: this.data['form']['status'],
                comments: this.data['form']['comments'],
                closedBy: this.auth.userCRC,
                uidCloser: this.auth.userCRC.uid
              };
      
              this.dbs.ssggRequestsCollection.doc(this.data['requestId']).set(requestObject, {merge: true}).then(() => {

                // UPDATING IN REQUESTS DB
                let log = {
                  action: 'Request edited!',
                  data: requestObject,
                  regdate: Date.now()
                }

                this.dbs.addSsggRequestLog(this.data['requestId'], log)
                  .then(() => {
                    this.dialogRef.close(true);
                    this.uploading_final = false;
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
