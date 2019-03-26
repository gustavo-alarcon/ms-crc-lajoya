import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-quality-redo-analyze-confirm-edit',
  templateUrl: './quality-redo-analyze-confirm-edit.component.html',
  styles: []
})
export class QualityRedoAnalyzeConfirmEditComponent implements OnInit {

  uploading: boolean = false;

  uploadPercent_initial: Observable<number>;
  uploading_initial: boolean = false;

  uploadPercent_2: Observable<number>;
  uploading_2: boolean = false;

  uploadPercent_3: Observable<number>;
  uploading_3: boolean = false;

  uploadPercent_4: Observable<number>;
  uploading_4: boolean = false;

  uploadPercent_5: Observable<number>;
  uploading_5: boolean = false;
  
  analyzeObject: object;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private storage: AngularFireStorage,
    private dialogRef: MatDialogRef<QualityRedoAnalyzeConfirmEditComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  save(): void{
    this.uploading =  true;

    let metaObject = {
      involvedAreas: this.data['involvedAreas'],
      responsibleStaff: this.data['responsibleStaff'],
      modifiedBy: this.auth.userCRC,
      uidEditor: this.auth.userCRC.uid
    };

    let reportObject = Object.assign(this.data['form'], metaObject);

    this.dbs.qualityRedosCollection.doc(this.data['redo']['id']).set(reportObject,{merge:true}).then(() => {

      // Creating log object
      let log = {
        action: 'Modified analysis!',
        data: reportObject,
        regdate: Date.now()
      }
      
      // Adding log to redo
      this.dbs.addQualityRedoLog(this.data['redo']['id'], log)
        .then(() => {
          this.dialogRef.close('Analizar');
          this.uploading = false;
        })
        .catch(error => {
          console.log(error);
          this.uploading = false;
          this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
            duration:6000
          });
        });

      // uploading task for supervisor
      this.dbs.usersCollection
        .doc(this.data['redo']['area']['supervisor']['uid'])
        .collection(`tasks`)
        .doc(this.data['redo']['id'])
        .set(reportObject, {merge: true})
      
      // Adding notification to area supervisor
      this.dbs.usersCollection
        .doc(this.data['redo']['area']['supervisor']['uid'])
        .collection(`notifications`)
        .add({
          regDate: Date.now(),
          senderId: this.auth.userCRC.uid,
          senderName: this.auth.userCRC.displayName,
          areaSupervisorId: this.data['redo']['area']['supervisor']['uid'],
          areaSupervisorName: this.data['redo']['area']['supervisor']['displayName'],
          redoId: this.data['redo']['id'],
          component: this.data['redo']['component'],
          OT: this.data['redo']['OT'],
          description: this.data['redo']['description'],
          status: 'unseen',
          type: 'quality redo analyze supervisor'
        })
          .then(ref => {
            ref.update({id: ref.id})
            this.snackbar.open("Listo!","Cerrar",{
              duration: 10000
            });
          });

      // sending notification to involved areas
      this.data['involvedAreas'].forEach(element => {
        this.dbs.usersCollection
        .doc(element['supervisor']['uid'])
        .collection(`notifications`)
        .add({
          regDate: Date.now(),
          senderId: this.auth.userCRC.uid,
          senderName: this.auth.userCRC.displayName,
          areaSupervisorId: element['supervisor']['uid'],
          areaSupervisorName: element['supervisor']['displayName'],
          redoId: this.data['redo']['id'],
          component: this.data['redo']['component'],
          OT: this.data['redo']['OT'],
          description: this.data['redo']['description'],
          status: 'unseen',
          type: 'quality redo analyze involved supervisor'
        })
          .then(ref => {
            ref.update({id: ref.id})
            this.snackbar.open("Listo!","Cerrar",{
              duration: 10000
            });
          });
      });

      this.data['responsibleStaff'].forEach(element => {
        this.dbs.usersCollection
        .doc(element['uid'])
        .collection(`notifications`)
        .add({
          regDate: Date.now(),
          senderId: this.auth.userCRC.uid,
          senderName: this.auth.userCRC.displayName,
          staffId: element['uid'],
          staffName: element['displayName'],
          redoId: this.data['redo']['id'],
          component: this.data['redo']['component'],
          OT: this.data['redo']['OT'],
          description: this.data['redo']['description'],
          status: 'unseen',
          type: 'quality redo analyze responsible staff'
        })
          .then(ref => {
            ref.update({id: ref.id})
            this.snackbar.open("Listo!","Cerrar",{
              duration: 10000
            });
          });
      })
      
      // UNDER DEVELOPING
      // Adding notifications to Redo's report notification list
      // this.qualityRedoReportNotificationList.forEach(element => {
      //   this.dbs.usersCollection
      //   .doc(element['uid'])
      //   .collection(`notifications`)
      //   .add({
      //     regDate: Date.now(),
      //     senderId: this.auth.userCRC.uid,
      //     senderName: this.auth.userCRC.displayName,
      //     areaSupervisorId: element['uid'],
      //     areaSupervisorName: element['displayName'],
      //     redoId: reportRef.id,
      //     component: this.data['form']['component'],
      //     OT: this.data['form']['OT'],
      //     description: this.data['form']['description'],
      //     status: 'unseen',
      //     canUpdate: element['canUpdate'],
      //     type: 'quality redo report list'
      //   })
      //     .then(ref => {
      //       ref.update({id: ref.id})
      //       this.snackbar.open("Listo!","Cerrar",{
      //         duration: 10000
      //       });
      //     });
      // })

    }).catch(err => {
      console.log(err);
      this.snackbar.open(err,"Cerrar",{
        duration: 10000
      });
    });

    if(this.data['initialImage']){
      this.uploading_initial = true;

      const filePath = `/qualityAnalyzePictures/${this.data['initialImage'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['initialImage']);

      this.uploadPercent_initial = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){

              let metaObject = {
                initialPicture: res,
              };
      
              this.dbs.qualityRedosCollection.doc(this.data['redo']['id']).set(metaObject,{merge: true}).then(() => {

                // Creating log object
                let log = {
                  action: 'Report created!',
                  data: metaObject,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(this.data['redo']['id'], log)
                  .then(() => {
                    this.dialogRef.close('Analizar');
                    this.uploading_initial = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_initial = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // Updating task for supervisor
                this.dbs.usersCollection
                  .doc(this.data['redo']['area']['supervisor']['uid'])
                  .collection(`tasks`)
                  .doc(this.data['redo']['id'])
                  .set(metaObject, {merge: true})
                
                // Updating task for involved areas
                this.data['involvedAreas'].forEach(element => {
                  this.dbs.usersCollection
                    .doc(element['supervisor']['uid'])
                    .collection(`tasks`)
                    .doc(this.data['redo']['id'])
                    .set(metaObject, {merge: true})
                });

                // Updating task for responsible staff
                this.data['responsibleStaff'].forEach(element => {
                  this.dbs.usersCollection
                    .doc(element['uid'])
                    .collection(`tasks`)
                    .doc(this.data['redo']['id'])
                    .set(metaObject, {merge: true})
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

    if(this.data['image_2']){
      this.uploading_2 = true;

      const filePath = `/qualityAnalyzePictures/${this.data['image_2'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['image_2']);

      this.uploadPercent_2 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){

              let metaObject = {
                image_2: res,
              };
      
              this.dbs.qualityRedosCollection.doc(this.data['redo']['id']).set(metaObject,{merge: true}).then(() => {

                // Creating log object
                let log = {
                  action: 'Report created!',
                  data: metaObject,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(this.data['redo']['id'], log)
                  .then(() => {
                    this.dialogRef.close('Analizar');
                    this.uploading_initial = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_initial = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // Updating task for supervisor
                this.dbs.usersCollection
                  .doc(this.data['redo']['area']['supervisor']['uid'])
                  .collection(`tasks`)
                  .doc(this.data['redo']['id'])
                  .set(metaObject, {merge: true})
                
                // Updating task for involved areas
                this.data['involvedAreas'].forEach(element => {
                  this.dbs.usersCollection
                    .doc(element['supervisor']['uid'])
                    .collection(`tasks`)
                    .doc(this.data['redo']['id'])
                    .set(metaObject, {merge: true})
                });

                // Updating task for responsible staff
                this.data['responsibleStaff'].forEach(element => {
                  this.dbs.usersCollection
                    .doc(element['uid'])
                    .collection(`tasks`)
                    .doc(this.data['redo']['id'])
                    .set(metaObject, {merge: true})
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

    if(this.data['image_3']){
      this.uploading_3 = true;

      const filePath = `/qualityAnalyzePictures/${this.data['image_3'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['image_3']);

      this.uploadPercent_3 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){

              let metaObject = {
                image_3: res,
              };
      
              this.dbs.qualityRedosCollection.doc(this.data['redo']['id']).set(metaObject,{merge: true}).then(() => {

                // Creating log object
                let log = {
                  action: 'Report created!',
                  data: metaObject,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(this.data['redo']['id'], log)
                  .then(() => {
                    this.dialogRef.close('Analizar');
                    this.uploading_initial = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_3 = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // Updating task for supervisor
                this.dbs.usersCollection
                  .doc(this.data['redo']['area']['supervisor']['uid'])
                  .collection(`tasks`)
                  .doc(this.data['redo']['id'])
                  .set(metaObject, {merge: true})
                
                // Updating task for involved areas
                this.data['involvedAreas'].forEach(element => {
                  this.dbs.usersCollection
                    .doc(element['supervisor']['uid'])
                    .collection(`tasks`)
                    .doc(this.data['redo']['id'])
                    .set(metaObject, {merge: true})
                });

                // Updating task for responsible staff
                this.data['responsibleStaff'].forEach(element => {
                  this.dbs.usersCollection
                    .doc(element['uid'])
                    .collection(`tasks`)
                    .doc(this.data['redo']['id'])
                    .set(metaObject, {merge: true})
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

    if(this.data['image_4']){
      this.uploading_4 = true;

      const filePath = `/qualityAnalyzePictures/${this.data['image_4'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['image_4']);

      this.uploadPercent_4 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){

              let metaObject = {
                image_4: res,
              };
      
              this.dbs.qualityRedosCollection.doc(this.data['redo']['id']).set(metaObject,{merge: true}).then(() => {

                // Creating log object
                let log = {
                  action: 'Report created!',
                  data: metaObject,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(this.data['redo']['id'], log)
                  .then(() => {
                    this.dialogRef.close('Analizar');
                    this.uploading_initial = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_initial = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // Updating task for supervisor
                this.dbs.usersCollection
                  .doc(this.data['redo']['area']['supervisor']['uid'])
                  .collection(`tasks`)
                  .doc(this.data['redo']['id'])
                  .set(metaObject, {merge: true})
                
                // Updating task for involved areas
                this.data['involvedAreas'].forEach(element => {
                  this.dbs.usersCollection
                    .doc(element['supervisor']['uid'])
                    .collection(`tasks`)
                    .doc(this.data['redo']['id'])
                    .set(metaObject, {merge: true})
                });

                // Updating task for responsible staff
                this.data['responsibleStaff'].forEach(element => {
                  this.dbs.usersCollection
                    .doc(element['uid'])
                    .collection(`tasks`)
                    .doc(this.data['redo']['id'])
                    .set(metaObject, {merge: true})
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

    if(this.data['image_5']){
      this.uploading_5 = true;

      const filePath = `/qualityAnalyzePictures/${this.data['image_5'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['image_5']);

      this.uploadPercent_5 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){

              let metaObject = {
                image_5: res,
              };
      
              this.dbs.qualityRedosCollection.doc(this.data['redo']['id']).set(metaObject,{merge: true}).then(() => {

                // Creating log object
                let log = {
                  action: 'Report created!',
                  data: metaObject,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(this.data['redo']['id'], log)
                  .then(() => {
                    this.dialogRef.close('Analizar');
                    this.uploading_initial = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_initial = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // Updating task for supervisor
                this.dbs.usersCollection
                  .doc(this.data['redo']['area']['supervisor']['uid'])
                  .collection(`tasks`)
                  .doc(this.data['redo']['id'])
                  .set(metaObject, {merge: true})
                
                // Updating task for involved areas
                this.data['involvedAreas'].forEach(element => {
                  this.dbs.usersCollection
                    .doc(element['supervisor']['uid'])
                    .collection(`tasks`)
                    .doc(this.data['redo']['id'])
                    .set(metaObject, {merge: true})
                });

                // Updating task for responsible staff
                this.data['responsibleStaff'].forEach(element => {
                  this.dbs.usersCollection
                    .doc(element['uid'])
                    .collection(`tasks`)
                    .doc(this.data['redo']['id'])
                    .set(metaObject, {merge: true})
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
