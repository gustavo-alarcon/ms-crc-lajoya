import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-quality-redo-report-confirm-create',
  templateUrl: './quality-redo-report-confirm-create.component.html',
  styles: []
})
export class QualityRedoReportConfirmCreateComponent implements OnInit {

  sendNotificationsControl = new FormControl(true);

  uploadPercent_initial: Observable<number>;
  uploading_initial: boolean = false;
  
  reportObject: object;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private storage: AngularFireStorage,
    private dialogRef: MatDialogRef<QualityRedoReportConfirmCreateComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  save(): void{

    if(this.data['initialImage']){
      this.uploading_initial = true;

      const filePath = `/qualityReportsPictures/${this.data['initialImage'].name}_${Date.now()}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.data['initialImage']);

      this.uploadPercent_initial = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){

              let metaObject = {
                id: '',
                initialPicture: res,
                finalPicture: '',
                regDate: Date.now(),
                realTerminationDate: 0,
                status: 'Confirmado',
                stage: 'Reporte',
                source: 'quality',
                createdBy: this.auth.userCRC,
                uidCreator: this.auth.userCRC.uid,
                uidSupervisor: this.data['form']['area']['supervisor']['uid'],
              };

              if(!this.sendNotificationsControl.value){
                metaObject['status'] = 'Confirmado'
              }

              this.reportObject = Object.assign(this.data['form'], metaObject);
      
              this.dbs.qualityRedosCollection.add(this.reportObject).then(reportRef => {

                reportRef.update({id: reportRef.id});
                
                this.reportObject['id'] = reportRef.id;

                // Creating log object
                let log = {
                  action: 'Report created!',
                  data: this.reportObject,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(reportRef.id, log)
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

                // NOTIFICATIONS
                if(this.sendNotificationsControl.value){

                  // Adding notification to area supervisor
                  this.dbs.usersCollection
                    .doc(this.data['form']['area']['supervisor']['uid'])
                    .collection(`notifications`)
                    .add({
                      regDate: Date.now(),
                      senderId: this.auth.userCRC.uid,
                      senderName: this.auth.userCRC.displayName,
                      areaSupervisorId: this.data['form']['area']['supervisor']['uid'],
                      areaSupervisorName: this.data['form']['area']['supervisor']['displayName'],
                      redoId: reportRef.id,
                      component: this.data['form']['component'],
                      OT: this.data['form']['OT'],
                      description: this.data['form']['description'],
                      redoStatus: 'Por confirmar',
                      status: 'unseen',
                      type: 'quality redo report supervisor'
                    })
                      .then(ref => {
                        ref.update({id: ref.id})
                        this.snackbar.open("Listo!","Cerrar",{
                          duration: 10000
                        });
                      });
                  
                  
                  // sending notifications to the technicians
                  this.dbs.qualityRedoTechnicians.forEach(user => {
                    this.dbs.usersCollection
                    .doc(user['uid'])
                    .collection(`notifications`)
                    .add({
                      regDate: Date.now(),
                      senderId: this.auth.userCRC.uid,
                      senderName: this.auth.userCRC.displayName,
                      areaSupervisorId: user['uid'],
                      areaSupervisorName: user['displayName'],
                      redoId: reportRef.id,
                      component: this.data['form']['component'],
                      OT: this.data['form']['OT'],
                      description: this.data['form']['description'],
                      status: 'unseen',
                      type: 'quality redo report technician'
                    })
                      .then(ref => {
                        ref.update({id: ref.id})
                        this.snackbar.open("Listo!","Cerrar",{
                          duration: 10000
                        });
                      });
                  })

                  // sending notifications to the quality supervisors
                  this.dbs.qualityRedoQualityAnalysts.forEach(user => {
                    this.dbs.usersCollection
                    .doc(user['uid'])
                    .collection(`notifications`)
                    .add({
                      regDate: Date.now(),
                      senderId: this.auth.userCRC.uid,
                      senderName: this.auth.userCRC.displayName,
                      areaSupervisorId: user['uid'],
                      areaSupervisorName: user['displayName'],
                      redoId: reportRef.id,
                      component: this.data['form']['component'],
                      OT: this.data['form']['OT'],
                      description: this.data['form']['description'],
                      status: 'unseen',
                      type: 'quality redo report quality supervisor'
                    })
                      .then(ref => {
                        ref.update({id: ref.id})
                        this.snackbar.open("Listo!","Cerrar",{
                          duration: 10000
                        });
                      });
                  })
                }
                

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
