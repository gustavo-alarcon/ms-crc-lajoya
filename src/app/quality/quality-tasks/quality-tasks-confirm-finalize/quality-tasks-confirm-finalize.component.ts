import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/core/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-quality-tasks-confirm-finalize',
  templateUrl: './quality-tasks-confirm-finalize.component.html',
  styles: []
})
export class QualityTasksConfirmFinalizeComponent implements OnInit {

  uploadPercent_1: Observable<number>;
  uploadPercent_2: Observable<number>;
  uploadPercent_3: Observable<number>;
  uploadPercent_4: Observable<number>;
  uploadPercent_5: Observable<number>;
  uploadPercent_6: Observable<number>;
  uploading_1: boolean = false;
  uploading_2: boolean = false;
  uploading_3: boolean = false;
  uploading_4: boolean = false;
  uploading_5: boolean = false;
  uploading_6: boolean = false;

  now: number = Date.now();

  constructor(
    public dialogRef: MatDialogRef<QualityTasksConfirmFinalizeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dbs: DatabaseService,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    public auth: AuthService
  ) { }

  ngOnInit() {
  }

  save(): void{

    this.dbs.qualityRedosCollection.doc(this.data['task']['redoId']).collection('actions').doc(this.data['task']['id']).set({details: this.data['details'], status: 'Finalizado', realTerminationDate: this.now},{merge: true});

    if(this.data['img1']){
      this.uploading_1 = true;

      const filePath = `/qualityTasksPictures/${Date.now()}_${this.data['img1'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['img1']);

      this.uploadPercent_1 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){
      
              this.dbs.qualityRedosCollection.doc(this.data['task']['redoId']).collection('actions').doc(this.data['task']['id']).set({finalPicture: res},{merge: true}).then(() => {

                // Creating log object
                let log = {
                  action: 'Action finalized - Image 1 uploaded!',
                  data: res,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(this.data['task']['redoId'], log)
                  .then(() => {
                    this.dialogRef.close(true);
                    this.uploading_1 = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_1 = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // Updating task for action responsibles
                this.data['task']['actionResponsibles'].forEach(staff => {
                  this.dbs.usersCollection
                    .doc(staff['uid'])
                    .collection(`tasks`)
                    .doc(this.data['task']['id'])
                    .set({finalPicture: res, status: 'Finalizado', realTerminationDate: this.now}, {merge: true})
                })

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

    if(this.data['img2']){
      this.uploading_2 = true;

      const filePath = `/qualityTasksPictures/${Date.now()}_${this.data['img2'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['img2']);

      this.uploadPercent_2 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){
      
              this.dbs.qualityRedosCollection.doc(this.data['task']['redoId']).collection('actions').doc(this.data['task']['id']).set({finalPicture2: res},{merge: true}).then(() => {

                // Creating log object
                let log = {
                  action: 'Action finalized - Image 2 uploaded!',
                  data: res,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(this.data['task']['redoId'], log)
                  .then(() => {
                    this.dialogRef.close(true);
                    this.uploading_1 = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_1 = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // Updating task for action responsibles
                this.data['task']['actionResponsibles'].forEach(staff => {
                  this.dbs.usersCollection
                    .doc(staff['uid'])
                    .collection(`tasks`)
                    .doc(this.data['task']['id'])
                    .set({finalPicture2: res, status: 'Finalizado', realTerminationDate: this.now}, {merge: true})
                })
                
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

    if(this.data['img3']){
      this.uploading_3 = true;

      const filePath = `/qualityTasksPictures/${Date.now()}_${this.data['img3'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['img3']);

      this.uploadPercent_3 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){
      
              this.dbs.qualityRedosCollection.doc(this.data['task']['redoId']).collection('actions').doc(this.data['task']['id']).set({finalPicture3: res},{merge: true}).then(() => {

                // Creating log object
                let log = {
                  action: 'Action finalized - Image 3 uploaded!',
                  data: res,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(this.data['task']['redoId'], log)
                  .then(() => {
                    this.dialogRef.close(true);
                    this.uploading_1 = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_1 = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // Updating task for action responsibles
                this.data['task']['actionResponsibles'].forEach(staff => {
                  this.dbs.usersCollection
                    .doc(staff['uid'])
                    .collection(`tasks`)
                    .doc(this.data['task']['id'])
                    .set({finalPicture3: res, status: 'Finalizado', realTerminationDate: this.now}, {merge: true})
                })

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

    if(this.data['arch1']){
      this.uploading_4 = true;

      const filePath = `/qualityTasksArchives/${Date.now()}_${this.data['arch1'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['arch1']);

      this.uploadPercent_4 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){
      
              this.dbs.qualityRedosCollection.doc(this.data['task']['redoId']).collection('actions').doc(this.data['task']['id']).set({finalArchive: res},{merge: true}).then(() => {

                // Creating log object
                let log = {
                  action: 'Action finalized - Image 1 uploaded!',
                  data: res,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(this.data['task']['redoId'], log)
                  .then(() => {
                    this.dialogRef.close(true);
                    this.uploading_1 = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_1 = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // Updating task for action responsibles
                this.data['task']['actionResponsibles'].forEach(staff => {
                  this.dbs.usersCollection
                    .doc(staff['uid'])
                    .collection(`tasks`)
                    .doc(this.data['task']['id'])
                    .set({finalArchive: res, status: 'Finalizado', realTerminationDate: this.now}, {merge: true})
                })

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

    if(this.data['arch2']){
      this.uploading_5 = true;

      const filePath = `/qualityTasksArchives/${Date.now()}_${this.data['arch2'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['arch2']);

      this.uploadPercent_5 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){
      
              this.dbs.qualityRedosCollection.doc(this.data['task']['redoId']).collection('actions').doc(this.data['task']['id']).set({finalArchive2: res},{merge: true}).then(() => {

                // Creating log object
                let log = {
                  action: 'Action finalized - Image 1 uploaded!',
                  data: res,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(this.data['task']['redoId'], log)
                  .then(() => {
                    this.dialogRef.close(true);
                    this.uploading_1 = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_1 = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // Updating task for action responsibles
                this.data['task']['actionResponsibles'].forEach(staff => {
                  this.dbs.usersCollection
                    .doc(staff['uid'])
                    .collection(`tasks`)
                    .doc(this.data['task']['id'])
                    .set({finalArchive2: res, status: 'Finalizado', realTerminationDate: this.now}, {merge: true})
                })

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

    if(this.data['arch3']){
      this.uploading_6 = true;

      const filePath = `/qualityTasksArchives/${Date.now()}_${this.data['arch3'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['arch3']);

      this.uploadPercent_6 = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){
      
              this.dbs.qualityRedosCollection.doc(this.data['task']['redoId']).collection('actions').doc(this.data['task']['id']).set({finalArchive3: res},{merge: true}).then(() => {

                // Creating log object
                let log = {
                  action: 'Action finalized - Image 1 uploaded!',
                  data: res,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(this.data['task']['redoId'], log)
                  .then(() => {
                    this.dialogRef.close(true);
                    this.uploading_1 = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_1 = false;
                    this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // Updating task for action responsibles
                this.data['task']['actionResponsibles'].forEach(staff => {
                  this.dbs.usersCollection
                    .doc(staff['uid'])
                    .collection(`tasks`)
                    .doc(this.data['task']['id'])
                    .set({finalArchive3: res, status: 'Finalizado', realTerminationDate: this.now}, {merge: true})
                })

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
