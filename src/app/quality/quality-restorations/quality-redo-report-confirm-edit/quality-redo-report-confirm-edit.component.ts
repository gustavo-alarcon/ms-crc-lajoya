import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-quality-redo-report-confirm-edit',
  templateUrl: './quality-redo-report-confirm-edit.component.html',
  styles: []
})
export class QualityRedoReportConfirmEditComponent implements OnInit {

  uploadPercent_initial: Observable<number>;
  uploading_initial: boolean = false;

  uploading: boolean = false;
  
  reportObject: object;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private storage: AngularFireStorage,
    private dialogRef: MatDialogRef<QualityRedoReportConfirmEditComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  save(): void{

    if(this.data['initialImage']){
      this.uploading_initial = true;

      const filePath = `/qualityReportsPictures/${this.data['initialImage'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['initialImage']);

      this.uploadPercent_initial = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){

              let metaObject = {
                initialPicture: res,
                editedBy: this.auth.userCRC,
                uidModifier: this.auth.userCRC.uid,
                notificationList: []
              };

              this.reportObject = Object.assign(this.data['form'], metaObject);
      
              this.dbs.qualityRedosCollection.doc(this.data['reportId']).set(this.reportObject, {merge: true}).then(() => {              

                // Creating log object
                let log = {
                  action: 'Report edited!',
                  data: this.reportObject,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(this.data['reportId'], log)
                  .then(() => {
                    this.dialogRef.close(true);
                    this.uploading_initial = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_initial = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // Adding task to supervisor
                this.dbs.usersCollection
                  .doc(this.data['form']['area']['supervisor']['uid'])
                  .collection(`tasks`)
                  .doc(this.data['reportId'])
                  .set(this.reportObject, {merge: true})

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

      this.uploading = true;

      let metaObject = {
        editedBy: this.auth.userCRC,
        uidModifier: this.auth.userCRC.uid,
        notificationList: []
      };

      this.reportObject = Object.assign(this.data['form'], metaObject);

      this.dbs.qualityRedosCollection.doc(this.data['reportId']).set(this.reportObject, {merge: true}).then(() => {              

        // Creating log object
        let log = {
          action: 'Report edited!',
          data: this.reportObject,
          regdate: Date.now()
        }
        
        // Adding log to redo
        this.dbs.addQualityRedoLog(this.data['reportId'], log)
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

        // Adding task to supervisor
        this.dbs.usersCollection
          .doc(this.data['form']['area']['supervisor']['uid'])
          .collection(`tasks`)
          .doc(this.data['reportId'])
          .set(this.reportObject, {merge: true})

      }).catch(err => {
        console.log(err);
        this.snackbar.open(err,"Cerrar",{
          duration: 10000
        });
      });
    }

  }

}
