import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-fred-confirm-edit',
  templateUrl: './fred-confirm-edit.component.html',
  styles: []
})
export class FredConfirmEditComponent implements OnInit {

  uploadPercent_initial: Observable<number>;
  uploading_initial: boolean = false;
  uploadPercent_final: Observable<number>;
  uploading_final: boolean = false;
  mergedForms: any;
  observations: Array<any> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private storage: AngularFireStorage,
    private dialogRef: MatDialogRef<FredConfirmEditComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    if(this.data['form']['list1'] != 'No observado'){
      this.observations.push({group: 'Orden y Limpieza', observations: [this.data['form']['list1']]});
    }
    if(this.data['form']['list2'] != 'No observado'){
      this.observations.push({group: 'Equipos de Protección Personal', observations: [this.data['form']['list2']]});
    }
    if(this.data['form']['list3'] != 'No observado'){
      this.observations.push({group: 'Control de Riesgos Operacionales', observations: [this.data['form']['list3']]});
    }
    if(this.data['form']['list4'] != 'No observado'){
      this.observations.push({group: 'Herramientas y equipos', observations: [this.data['form']['list4']]});
    }
    if(this.data['form']['list5'] != 'No observado'){
      this.observations.push({group: 'Riesgos Críticos', observations: [this.data['form']['list5']]});
    }

  }

  save(): void{
    this.uploadFile();
  }

  uploadFile(): void{

    if(this.data['initialImage']){
      this.uploading_initial = true;

      const filePath = `/securityFredsPictures/${this.data['initialImage'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['initialImage']);

      this.uploadPercent_initial = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){
              let percentNumber = this.data['form']['percent'];
              let status = this.data['form']['status'];
              let estimatedDate = this.data['form']['estimatedTerminationDate']?this.data['form']['estimatedTerminationDate'].valueOf():0;
              let realDate = this.data['form']['realTerminationDate']?this.data['form']['realTerminationDate'].valueOf():0;
              let solved = false;

              if(this.data['form']['status'] === 'Finalizado' || this.data['form']['percent'] === 100){
                solved = true;
              }

              /*
               Here we are not using the sollowing key to avoid overwrite:

                -finalPicture
                -createdBy
                -source
                -uidStaff
                -uisSupervisor
                -regDate
              */
              
              let lastObject = {
                initialPicture: res,
                estimatedTerminationDate: estimatedDate,
                realTerminationDate: realDate,
                percent: percentNumber,
                status: status,
                observations: this.observations,
                modifiedBy: this.auth.userCRC,
                uidEditor: this.auth.userCRC.uid
              };
      
              let finalObject = Object.assign(this.data['form'],lastObject);
              
              // UPDATING FRED WITH NEW INFO
              this.dbs.securityFredsCollection.doc(this.data['form']['id']).set(finalObject, {merge: true}).then(() => {

                // Creating log object
                let log = {
                  action: 'Fred edited!',
                  description: finalObject,
                  regdate: Date.now()
                }
                // Adding log to respective FRED
                this.dbs.addFredLog(this.data['form']['id'], log)
                  .then(() => {
                    this.dialogRef.close(true);
                    this.uploading_initial = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_initial = false;
                    this.snackbar.open("Ups!, parece que hubo un error (SF002) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // UPDATING IN OBSERVED'S TASKS
                this.dbs.usersCollection
                  .doc(this.data['form']['observedStaff']['uid'])
                  .collection(`tasks`)
                  .doc(this.data['form']['id'])
                  .set(finalObject, {merge: true})

                // REGISTRY IN SUPERVISOR TASKS DB AND NOTIFICATIONS DB
                this.dbs.usersCollection
                  .doc(this.data['form']['observedArea']['supervisor']['uid'])
                  .collection(`tasks`)
                  .doc(this.data['form']['id'])
                  .set(finalObject, {merge: true})

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

    }else{
      this.uploading_initial = true;

      let percentNumber = this.data['form']['percent'];
      let status = this.data['form']['status'];
      let estimatedDate = this.data['form']['estimatedTerminationDate']?this.data['form']['estimatedTerminationDate'].valueOf():0;
      let realDate = this.data['form']['realTerminationDate']?this.data['form']['realTerminationDate'].valueOf():0;
      let solved = false;

      if(this.data['form']['status'] === 'Finalizado' || this.data['form']['percent'] === 100){
        solved = true;
      }

      /*
        Here we are not using the sollowing key to avoid overwrite:

        -finalPicture
        -createdBy
        -source
        -uidStaff
        -uisSupervisor
        -regDate
      */

      let lastObject = {
        estimatedTerminationDate: estimatedDate,
        realTerminationDate: realDate,
        percent: percentNumber,
        status: status,
        observations: this.observations,
        uidEditor: this.auth.userCRC.uid
      };

      let finalObject = Object.assign(this.data['form'],lastObject);

      // UPDATING FRED WITH NEW INFO
      this.dbs.securityFredsCollection.doc(this.data['form']['id']).set(finalObject, {merge: true}).then(() => {

        // Creating log object
        let log = {
          action: 'Fred edited!',
          description:lastObject,
          regdate: Date.now()
        }

        this.dbs.addFredLog(this.data['form']['id'], log)
          .then(() => {
            this.dialogRef.close(true);
            this.uploading_initial = false;
          })
          .catch(error => {
            console.log(error);
            this.uploading_initial = false;
            this.snackbar.open("Ups!, parece que hubo un error (SF002) ...","Cerrar",{
              duration:6000
            });
          });

        // UPDATING IN OBSERVED TASKS DB AND NOTIFICATIONS DB
        this.dbs.usersCollection
          .doc(this.data['form']['observedStaff']['uid'])
          .collection(`tasks`)
          .doc(this.data['form']['id'])
          .set(finalObject, {merge: true})

        // UPDATING IN SUPERVISOR TASKS DB AND NOTIFICATIONS DB
        this.dbs.usersCollection
          .doc(this.data['form']['observedArea']['supervisor']['uid'])
          .collection(`tasks`)
          .doc(this.data['form']['id'])
          .set(finalObject, {merge: true})

      }).catch(err => {
        console.log(err);
        this.snackbar.open(err,"Cerrar",{
          duration: 10000
        });
      });
    }

    if(this.data['finalImage']){
      this.uploading_final = true;

      const filePath = `/securityFredsPictures/${this.data['finalImage'].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['finalImage']);

      this.uploadPercent_final = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){
              
              let lastObject = {
                finalPicture: res
              };
              
              // UPDATING FRED WITH NEW INFO
              this.dbs.securityFredsCollection.doc(this.data['form']['id']).set(lastObject, {merge: true}).then(refFred => {

                // Creating log object
                let log = {
                  action: 'Fred edited!',
                  description: lastObject,
                  regdate: Date.now()
                }
                // Adding log to respective FRED
                this.dbs.addFredLog(this.data['form']['id'], log)
                  .then(() => {
                    this.dialogRef.close(true);
                    this.uploading_final = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading_final = false;
                    this.snackbar.open("Ups!, parece que hubo un error (SF002) ...","Cerrar",{
                      duration:6000
                    });
                  });

                // UPDATING IN OBSERVED'S TASKS
                this.dbs.usersCollection
                  .doc(this.data['form']['observedStaff']['uid'])
                  .collection(`tasks`)
                  .doc(this.data['form']['id'])
                  .set(lastObject, {merge: true})

                // REGISTRY IN SUPERVISOR TASKS DB AND NOTIFICATIONS DB
                this.dbs.usersCollection
                  .doc(this.data['form']['observedArea']['supervisor']['uid'])
                  .collection(`tasks`)
                  .doc(this.data['form']['id'])
                  .set(lastObject, {merge: true})

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
