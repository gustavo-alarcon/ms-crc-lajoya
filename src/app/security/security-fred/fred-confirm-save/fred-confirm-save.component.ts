import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-confirm-save',
  templateUrl: './fred-confirm-save.component.html',
  styles: []
})
export class FredConfirmSaveComponent implements OnInit {

  uploadPercent: Observable<number>;
  mergedForms: any;
  uploading: boolean = false;
  observations: Array<any> = [];

  constructor(
    public dialogRef: MatDialogRef<FredConfirmSaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dbs: DatabaseService,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    public auth: AuthService
  ) { }

  ngOnInit() {
    
    if(this.data[1]['list1'] != 'No observado'){
      this.observations.push({group: 'Orden y Limpieza', observations: [this.data[1]['list1']]});
    }
    if(this.data[1]['list2'] != 'No observado'){
      this.observations.push({group: 'Equipos de Protección Personal', observations: [this.data[1]['list2']]});
    }
    if(this.data[1]['list3'] != 'No observado'){
      this.observations.push({group: 'Control de Riesgos Operacionales', observations: [this.data[1]['list3']]});
    }
    if(this.data[1]['list4'] != 'No observado'){
      this.observations.push({group: 'Herramientas y equipos', observations: [this.data[1]['list4']]});
    }
    if(this.data[1]['list5'] != 'No observado'){
      this.observations.push({group: 'Riesgos Críticos', observations: [this.data[1]['list5']]});
    }

    this.mergedForms = Object.assign(this.data[0],this.data[2]);
  }

  save(): void{
    this.uploadFile();
  }

  uploadFile(): void{

    if(this.data[3]){
      this.uploading = true;

      const filePath = `/securityFredsPictures/${Date.now()}_${this.data[3].name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data[3]);

      this.uploadPercent = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){
              let percentNumber = 0;
              let status = 'Por confirmar';
              let estimatedDate = 0;

              if(this.data[2]['solved']){
                percentNumber = 100;
                status = 'Finalizado';
                estimatedDate = Date.now();
              }



              let lastObject = {
                id:'',
                initialPicture: res,
                finalPicture: '',
                regDate: Date.now(),
                estimatedTerminationDate: estimatedDate,
                realTerminationDate: estimatedDate,
                createdBy: this.auth.userCRC,
                percent: percentNumber,
                status: status,
                observations: this.observations,
                source: 'fred',
                uid: this.auth.userCRC.uid,
                uidStaff: this.data[0]['observedStaff']['uid'],
                uidSupervisor: this.data[0]['observedArea']['supervisor']['uid']
              };
      
              let finalObject = Object.assign(this.mergedForms,lastObject);
      
              this.dbs.securityFredsCollection.add(finalObject).then(refFred => {

                // REGISTRY IN FRED DB
                refFred.update({id: refFred.id}).then(() => {
                  let log = {
                    action: 'Fred created!',
                    data: finalObject,
                    regdate: Date.now()
                  }

                  this.dbs.addFredLog(refFred.id, log)
                    .then(() => {
                      this.dialogRef.close(true);
                      this.uploading = false;
                    })
                    .catch(error => {
                      console.log(error);
                      this.uploading = false;
                      this.snackbar.open("Ups!, parece que hubo un error (SF002) ...","Cerrar",{
                        duration:6000
                      });
                    });
                });

                finalObject['id'] = refFred.id;

                // Adding task to observed staff
                this.dbs.usersCollection
                  .doc(this.data[0]['observedStaff']['uid'])
                  .collection(`tasks`)
                  .doc(refFred.id)
                  .set(finalObject)

                // Sending notification to observed staff. Also he/she has to confirm with estimated date of termination
                this.dbs.usersCollection
                  .doc(this.data[0]['observedStaff']['uid'])
                  .collection(`notifications`)
                  .add({
                    regDate: Date.now(),
                    senderId: this.auth.userCRC.uid,
                    senderName: this.auth.userCRC.displayName,
                    areaSupervisorId: this.data[0]['observedArea']['supervisor']['uid'],
                    areaSupervisorName: this.data[0]['observedArea']['supervisor']['displayName'],
                    taskStatus: 'Por confirmar',
                    fredId: refFred.id,
                    status: 'unseen',
                    subject: this.data[2]['substandardAct']+this.data[2]['substandardCondition']+this.data[2]['remarkableAct'],
                    type: 'task confirmation'
                  })
                    .then(ref => {
                      ref.update({id: ref.id})
                      this.snackbar.open("Listo!","Cerrar",{
                        duration: 10000
                      });
                    });
                
                let tempUids = [];
                
                // STAFF SUPERVISOR NESTED 1
                // checking if that supevisor exist
                if(this.data[0]['observedStaff']['area']){
                  tempUids.push(this.data[0]['observedStaff']['area']['supervisor']['uid']);
                  // Adding task to supervisor nested 1
                  this.dbs.usersCollection
                  .doc(this.data[0]['observedStaff']['area']['supervisor']['uid'])
                  .collection(`tasks`)
                  .doc(refFred.id)
                  .set(finalObject)

                  // sending notification to supervisor nested 1
                  this.dbs.usersCollection
                  .doc(this.data[0]['observedStaff']['area']['supervisor']['uid'])
                  .collection(`notifications`)
                  .add({
                    regDate: Date.now(),
                    senderId: this.auth.userCRC.uid,
                    senderName: this.auth.userCRC.displayName,
                    staffId: this.data[0]['observedStaff']['uid'],
                    staffName: this.data[0]['observedStaff']['displayName'],
                    fredId: refFred.id,
                    taskStatus: 'Por confirmar',
                    status: 'unseen',
                    subject: this.data[2]['substandardAct']+this.data[2]['substandardCondition']+this.data[2]['remarkableAct'],
                    type: 'task staff nested 1'
                  })
                    .then(ref => {
                      ref.update({id: ref.id})
                      this.snackbar.open("Listo!","Cerrar",{
                        duration: 10000
                      });
                    });
                }
                

                // STAFF SUPERVISOR NESTED 2
                // checking if that supevisor exist
                if(this.data[0]['observedStaff']['area']['supervisor']['area']){

                  // checking if already exist in uids array
                  let _index = tempUids.indexOf(this.data[0]['observedStaff']['area']['supervisor']['area']['supervisor']['uid']);
                  if(_index < 0){
                    tempUids.push(this.data[0]['observedStaff']['area']['supervisor']['area']['supervisor']['uid']);
                    // Adding task to supervisor nested 2
                    this.dbs.usersCollection
                    .doc(this.data[0]['observedStaff']['area']['supervisor']['area']['supervisor']['uid'])
                    .collection(`tasks`)
                    .doc(refFred.id)
                    .set(finalObject)

                    // sending notification to supervisor nested 2
                    this.dbs.usersCollection
                      .doc(this.data[0]['observedStaff']['area']['supervisor']['area']['supervisor']['uid'])
                      .collection(`notifications`)
                      .add({
                        regDate: Date.now(),
                        senderId: this.auth.userCRC.uid,
                        senderName: this.auth.userCRC.displayName,
                        staffId: this.data[0]['observedStaff']['uid'],
                        staffName: this.data[0]['observedStaff']['displayName'],
                        fredId: refFred.id,
                        taskStatus: 'Por confirmar',
                        status: 'unseen',
                        subject: this.data[2]['substandardAct']+this.data[2]['substandardCondition']+this.data[2]['remarkableAct'],
                        type: 'task staff nested 2'
                      })
                        .then(ref => {
                          ref.update({id: ref.id})
                          this.snackbar.open("Listo!","Cerrar",{
                            duration: 10000
                          });
                        });
                  }
                  
                }
                

                // checking if area supervisor uid already exists in list
                let _index = tempUids.indexOf(this.data[0]['observedArea']['supervisor']['uid']);
                if(_index < 0){
                  // Adding task to area supervisor
                  this.dbs.usersCollection
                  .doc(this.data[0]['observedArea']['supervisor']['uid'])
                  .collection(`tasks`)
                  .doc(refFred.id)
                  .set(finalObject)

                  this.dbs.usersCollection
                  .doc(this.data[0]['observedArea']['supervisor']['uid'])
                  .collection(`notifications`)
                  .add({
                    regDate: Date.now(),
                    senderId: this.auth.userCRC.uid,
                    senderName: this.auth.userCRC.displayName,
                    staffId: this.data[0]['observedStaff']['uid'],
                    staffName: this.data[0]['observedStaff']['displayName'],
                    fredId: refFred.id,
                    taskStatus: 'Por confirmar',
                    status: 'unseen',
                    subject: this.data[2]['substandardAct']+this.data[2]['substandardCondition']+this.data[2]['remarkableAct'],
                    type: 'task supervisor'
                  })
                    .then(ref => {
                      ref.update({id: ref.id})
                      this.snackbar.open("Listo!","Cerrar",{
                        duration: 10000
                      });
                    });
                }
                

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
      this.uploading = true;

      let percentNumber = 0;
      let status = 'Por confirmar';
      let estimatedDate = 0;

      if(this.data[2]['solved']){
        percentNumber = 100;
        status = 'Finalizado';
        estimatedDate = Date.now();
      }



      let lastObject = {
        id:'',
        initialPicture: '',
        finalPicture: '',
        regDate: Date.now(),
        estimatedTerminationDate: estimatedDate,
        realTerminationDate: estimatedDate,
        createdBy: this.auth.userCRC,
        percent: percentNumber,
        status: status,
        observations: this.observations,
        source: 'fred',
        uid: this.auth.userCRC.uid,
        uidStaff: this.data[0]['observedStaff']['uid'],
        uidSupervisor: this.data[0]['observedArea']['supervisor']['uid']
      };

      let finalObject = Object.assign(this.mergedForms,lastObject);

      this.dbs.securityFredsCollection.add(finalObject).then(refFred => {

        // REGISTRY IN FRED DB
        refFred.update({id: refFred.id}).then(() => {
          let log = {
            action: 'Fred created!',
            description: this.data[2]['upgradeOpportunity'],
            area: this.data[0]['observedArea'],
            regdate: Date.now()
          }

          this.dbs.addFredLog(refFred.id, log)
            .then(() => {
              this.dialogRef.close(true);
              this.uploading = false;
            })
            .catch(error => {
              console.log(error);
              this.uploading = false;
              this.snackbar.open("Ups!, parece que hubo un error (SF002) ...","Cerrar",{
                duration:6000
              });
            });
        });

        finalObject['id'] = refFred.id;

        // REGISTRY IN OBSERVED TASKS DB AND NOTIFICATIONS DB
        this.dbs.usersCollection
          .doc(this.data[0]['observedStaff']['uid'])
          .collection(`tasks`)
          .doc(refFred.id)
          .set(finalObject)

        this.dbs.usersCollection
          .doc(this.data[0]['observedStaff']['uid'])
          .collection(`notifications`)
          .add({
            regDate: Date.now(),
            senderId: this.auth.userCRC.uid,
            senderName: this.auth.userCRC.displayName,
            areaSupervisorId: this.data[0]['observedArea']['supervisor']['uid'],
            areaSupervisorName: this.data[0]['observedArea']['supervisor']['displayName'],
            fredId: refFred.id,
            status: 'unseen',
            subject: this.data[2]['substandardAct']+this.data[2]['substandardCondition']+this.data[2]['remarkableAct'],
            type: 'task done'
          })
            .then(ref => {
              ref.update({id: ref.id})
              this.snackbar.open("Listo!","Cerrar",{
                duration: 10000
              });
            });

        // REGISTRY IN SUPERVISOR TASKS DB AND NOTIFICATIONS DB
        this.dbs.usersCollection
          .doc(this.data[0]['observedArea']['supervisor']['uid'])
          .collection(`tasks`)
          .doc(refFred.id)
          .set(finalObject)

        this.dbs.usersCollection
          .doc(this.data[0]['observedArea']['supervisor']['uid'])
          .collection(`notifications`)
          .add({
            regDate: Date.now(),
            senderId: this.auth.userCRC.uid,
            senderName: this.auth.userCRC.displayName,
            staffId: this.data[0]['observedStaff']['uid'],
            staffName: this.data[0]['observedStaff']['displayName'],
            fredId: refFred.id,
            status: 'unseen',
            subject: this.data[2]['substandardAct']+this.data[2]['substandardCondition']+this.data[2]['remarkableAct'],
            type: 'task done supervisor'
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

  }

}
