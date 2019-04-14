import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { SelectionModel } from '@angular/cdk/collections';
import { QualityRedosActionsConfirmRequestClosingComponent } from '../quality-redos-actions-confirm-request-closing/quality-redos-actions-confirm-request-closing.component';

@Component({
  selector: 'app-quality-redo-actions-dialog-request-closing',
  templateUrl: './quality-redo-actions-dialog-request-closing.component.html',
  styles: []
})
export class QualityRedoActionsDialogRequestClosingComponent implements OnInit, OnDestroy {

  uploading: boolean = false;

  actionsArray: Array<any> = [];
  signingArray: Array<any> = [];
  confirmationArray: Array<any> = [];
  techniciansInvolved: Array<any> = [];
  

  selection = new SelectionModel(true, []);

  subscription: Array<Subscription> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<QualityRedoActionsDialogRequestClosingComponent>,
    public af: AngularFirestore

  ) { }

  ngOnInit() {
    let actionsListSubs = this.dbs.qualityRedosCollection
                            .doc(this.data['redo']['id'])
                            .collection('actions')
                            .valueChanges()
                            .subscribe(res => {
                              this.actionsArray = res;

                              // pushing the area supervisor of the report
                              this.confirmationArray.push({
                                sign: false,
                                displayName: this.data['redo']['area']['supervisor']['displayName'],
                                uid: this.data['redo']['area']['supervisor']['uid']
                              });
                              

                              // pushing the technician responsible of elevate the report to analyze stage
                              this.confirmationArray.push({
                                sign: false,
                                displayName: this.data['redo']['upgradedToAnalyzeBy']['displayName'],
                                uid: this.data['redo']['upgradedToAnalyzeBy']['uid']
                              });
                              // adding the technician to list
                              this.techniciansInvolved.push(this.data['redo']['upgradedToAnalyzeBy']);

                              // pushing the technician responsible of elevate the analyze to actions stage
                              this.confirmationArray.push({
                                sign: false,
                                displayName: this.data['redo']['upgradedToActionsBy']['displayName'],
                                uid: this.data['redo']['upgradedToActionsBy']['uid']
                              });
                              // adding technician to list, but checking if is already lsited
                              if(this.techniciansInvolved[0]['uid'] != this.data['redo']['uidActionsUpgrader']){
                                this.techniciansInvolved.push(this.data['redo']['upgradedToActionsBy']);
                              }
                              

                              // pushing the action responsibles from actions stage
                              res.forEach(action => {
                                action['actionResponsibles'].forEach(responsible => {
                                  this.confirmationArray.push({
                                    sign: false,
                                    displayName: responsible['displayName'],
                                    uid: responsible['uid']
                                  });
                                })
                              });

                              // pushing the area supervisor of involved areas in analyze stage
                              this.data['redo']['involvedAreas'].forEach(area => {
                                this.confirmationArray.push({
                                  sign: false,
                                  displayName: area['supervisor']['displayName'],
                                  uid: area['supervisor']['uid']
                                });
                              });

                              // pushing the staff responsible in analyze stage
                              this.data['redo']['responsibleStaff'].forEach(staff => {
                                this.confirmationArray.push({
                                  sign: false,
                                  displayName: staff['displayName'],
                                  uid: staff['uid']
                                });
                              });

                              // pushing the confirmation list for closing
                              this.dbs.qualityRedoConfirmationList.forEach(user => {
                                this.confirmationArray.push({
                                  sign: false,
                                  displayName: user['displayName'],
                                  uid: user['uid']
                                });
                              })
                              
                            })

    this.subscription.push(actionsListSubs);
  }

  ngOnDestroy(){
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  request(): void{
    let dialogRef = this.dialog.open(QualityRedosActionsConfirmRequestClosingComponent, {
      data: {
        redo: this.data['redo'],
        confirmationList : this.confirmationArray
      }
    })

    dialogRef.afterClosed().subscribe( res => {
      if(res){
        this.dialogRef.close();
      }
    })
  }
  // prepareCollection(): void{
  //   this.dbs.qualityRedosCollection
  //   .doc(this.data['redo']['id'])
  //   .collection('signing')
  //   .get().forEach(snap => {
  //     this.signingArray = snap.docs;
  //   })

  //   this.signingArray.forEach(doc => {
  //     this.af.doc(doc.ref.path).delete();
  //     this.dbs.usersCollection.doc(this.auth.userCRC.uid).collection('notifications').doc(doc.ref.id).delete();
  //   })
  // }

  // request(): void{

  //   this.dbs.qualityRedosCollection
  //     .doc(this.data['redo']['id'])
  //     .collection('signing')
  //     .add({signed: false, user: this.data['redo']['area']['supervisor']})
  //       .then(ref => {
  //         ref.update({id: ref.id})
  //         // adding notification to main area supervisor
  //         this.dbs.usersCollection
  //         .doc(this.data['redo']['area']['supervisor']['uid'])
  //         .collection('notifications')
  //         .add({
  //           regDate: Date.now(),
  //           senderId: this.auth.userCRC.uid,
  //           senderName: this.auth.userCRC.displayName,
  //           redoId: this.data['redo']['id'],
  //           signId: ref.id,
  //           component: this.data['redo']['component'],
  //           OT: this.data['redo']['OT'],
  //           description: this.data['redo']['description'],
  //           kind: 'Supervisor de área principal',
  //           requestStatus: 'Por confirmar',
  //           status: 'unseen',
  //           type: 'quality redo actions request closing'
  //         })
  //           .then(ref => {
  //             ref.update({id: ref.id})
  //             this.dialog.close(true);
  //             this.snackbar.open("Listo!","Cerrar", {
  //               duration: 6000
  //             })
  //           })
  //           .catch(error => {
  //             console.log(error);
  //             this.uploading = false;
  //             this.snackbar.open("Ups!, parece que hubo un error enviando la notificación al supervisor área principal...","Cerrar",{
  //               duration:6000
  //             });
  //           });
  //       })

    

  //   this.data['redo']['involvedAreas'].forEach(element => {
  //     this.dbs.qualityRedosCollection
  //       .doc(this.data['redo']['id'])
  //       .collection('signing')
  //       .add({signed: false, user: element})
  //         .then(ref => {
  //           ref.update({id: ref.id})
  //           // adding notification to involved areas
  //           this.dbs.usersCollection
  //           .doc(element['supervisor']['uid'])
  //           .collection('notifications')
  //           .add({
  //             regDate: Date.now(),
  //             senderId: this.auth.userCRC.uid,
  //             senderName: this.auth.userCRC.displayName,
  //             redoId: this.data['redo']['id'],
  //             signId: ref.id,
  //             component: this.data['redo']['component'],
  //             OT: this.data['redo']['OT'],
  //             description: this.data['redo']['description'],
  //             kind: 'Supervisor de área involucrada',
  //             requestStatus: 'Por confirmar',
  //             status: 'unseen',
  //             type: 'quality redo actions request closing'
  //           })
  //             .then(ref => {
  //               ref.update({id: ref.id})
  //             })
  //             .catch(error => {
  //               console.log(error);
  //               this.uploading = false;
  //               this.snackbar.open("Ups!, parece que hubo un error enviando la notificación al supervisor área involucrada...","Cerrar",{
  //                 duration:6000
  //               });
  //             });
  //         })
      
  //   });

  //   this.data['redo']['responsibleStaff'].forEach(element => {
  //     this.dbs.qualityRedosCollection
  //       .doc(this.data['redo']['id'])
  //       .collection('signing')
  //       .add({signed: false, user: element})
  //         .then(ref => {
  //           ref.update({id: ref.id})
  //           // adding notification to responsible staff
  //           this.dbs.usersCollection
  //           .doc(element['uid'])
  //           .collection('notifications')
  //           .add({
  //             regDate: Date.now(),
  //             senderId: this.auth.userCRC.uid,
  //             senderName: this.auth.userCRC.displayName,
  //             redoId: this.data['redo']['id'],
  //             signId: ref.id,
  //             component: this.data['redo']['component'],
  //             OT: this.data['redo']['OT'],
  //             description: this.data['redo']['description'],
  //             kind: 'Personal responsable',
  //             requestStatus: 'Por confirmar',
  //             status: 'unseen',
  //             type: 'quality redo actions request closing'
  //           })
  //             .then(ref => {
  //               ref.update({id: ref.id})
  //             })
  //             .catch(error => {
  //               console.log(error);
  //               this.uploading = false;
  //               this.snackbar.open("Ups!, parece que hubo un error enviando la notificación al supervisor área involucrada...","Cerrar",{
  //                 duration:6000
  //               });
  //             });
  //         })

      
  //   });

  //   this.actionsArray.forEach(element => {
  //     this.dbs.qualityRedosCollection
  //       .doc(this.data['redo']['id'])
  //       .collection('signing')
  //       .add({signed: false, user: element['actionResponsible']})
  //         .then(ref => {
  //           ref.update({id: ref.id})
  //           // adding notification to involved areas
  //           this.dbs.usersCollection
  //           .doc(element['actionResponsible']['uid'])
  //           .collection('notifications')
  //           .add({
  //             regDate: Date.now(),
  //             senderId: this.auth.userCRC.uid,
  //             senderName: this.auth.userCRC.displayName,
  //             redoId: this.data['redo']['id'],
  //             signId: ref.id,
  //             component: this.data['redo']['component'],
  //             OT: this.data['redo']['OT'],
  //             description: this.data['redo']['description'],
  //             requestStatus: 'Por confirmar',
  //             kind: 'Responsable de tarea - ' + element['action'],
  //             status: 'unseen',
  //             type: 'quality redo actions request closing'
  //           })
  //             .then(ref => {
  //               ref.update({id: ref.id})
  //             })
  //             .catch(error => {
  //               console.log(error);
  //               this.uploading = false;
  //               this.snackbar.open("Ups!, parece que hubo un error enviando la notificación al supervisor área involucrada...","Cerrar",{
  //                 duration:6000
  //               });
  //             });
  //         })

      
  //   });


  // }

}
