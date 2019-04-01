import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { DatabaseService } from 'src/app/core/database.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-quality-redo-actions-confirm-approve-actions',
  templateUrl: './quality-redo-actions-confirm-approve-actions.component.html',
  styles: []
})
export class QualityRedoActionsConfirmApproveActionsComponent implements OnInit {

  uploading: boolean = false;
  
  reportObject: object;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialogRef: MatDialogRef<QualityRedoActionsConfirmApproveActionsComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.data['selection'].forEach(element => {
      let index = this.data['redo']['actions'].indexOf(element);
      if(index > -1){
        this.data['redo']['actions'][index]['valid'] = true;
      }
      
    });
  }

  save(): void{

    this.uploading = true;

    this.reportObject = {
      actions: this.data['redo']['actions']
    };

    this.data['selection'].forEach(element => {
      this.dbs.qualityRedosCollection.doc(this.data['redo']['id']).collection('actions').doc(element['id']).update({valid: true})
        .then(() => {
          // adding task to action responsible
          this.dbs.usersCollection
            .doc(element['actionResponsible']['uid'])
            .collection(`tasks`)
            .doc(element['id'])
            .set(element, {merge: true})
          
          // sending notification to action responsible
          this.dbs.usersCollection
            .doc(element['actionResponsible']['uid'])
            .collection(`notifications`)
            .add({
              regDate: Date.now(),
              senderId: this.auth.userCRC.uid,
              senderName: this.auth.userCRC.displayName,
              redoId: this.data['redo']['id'],
              taskId: element['id'],
              component: this.data['redo']['component'],
              OT: this.data['redo']['OT'],
              description: this.data['redo']['description'],
              responsibleId: element['actionResponsible']['uid'],
              responsibleName: element['actionResponsible']['displayName'],
              actionStatus: element['status'],
              task: element['action'],
              status: 'unseen',
              type: 'quality redo actions task responsible'
            })
              .then(ref => {
                ref.update({id: ref.id})
                this.snackbar.open("Listo!","Cerrar",{
                  duration: 10000
                });
              });

          
          element['additionalStaff'].forEach(staff => {

            // adding task to action responsible
            this.dbs.usersCollection
              .doc(staff['uid'])
              .collection(`tasks`)
              .doc(element['id'])
              .set(element, {merge: true})
            
            // sending notifications to additional staff
            this.dbs.usersCollection
              .doc(staff['uid'])
              .collection(`notifications`)
              .add({
                regDate: Date.now(),
                senderId: this.auth.userCRC.uid,
                senderName: this.auth.userCRC.displayName,
                redoId: this.data['redo']['id'],
                taskId: element['id'],
                component: this.data['redo']['component'],
                OT: this.data['redo']['OT'],
                description: this.data['redo']['description'],
                staffId: staff['uid'],
                staffName: staff['displayName'],
                actionStatus: element['status'],
                task: element['action'],
                status: 'unseen',
                type: 'quality redo actions task staff'
              })
                .then(ref => {
                  ref.update({id: ref.id})
                  this.snackbar.open("Listo!","Cerrar",{
                    duration: 10000
                  });
                });
          })
        })
    })

    // Creating log object
    let log = {
      action: 'Adding actions!',
      data: this.reportObject,
      user: this.auth.userCRC,
      regdate: Date.now()
    }
    
    // Adding log to redo
    this.dbs.addQualityRedoLog(this.data['redo']['id'], log)
      .then(() => {
        this.dialogRef.close('Acciones');
        this.uploading = false;
      })
      .catch(error => {
        console.log(error);
        this.uploading = false;
        this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
          duration:6000
        });
      });

    
    // this.dbs.qualityRedosCollection.doc(this.data['redo']['id']).set(this.reportObject,{merge:true}).then(() => {

    //   // Creating log object
    //   let log = {
    //     action: 'Adding actions!',
    //     data: this.reportObject,
    //     user: this.auth.userCRC,
    //     regdate: Date.now()
    //   }
      
    //   // Adding log to redo
    //   this.dbs.addQualityRedoLog(this.data['redo']['id'], log)
    //     .then(() => {
    //       this.dialogRef.close('Acciones');
    //       this.uploading = false;
    //     })
    //     .catch(error => {
    //       console.log(error);
    //       this.uploading = false;
    //       this.snackbar.open("Ups!, parece que hubo un error (MR001) ...","Cerrar",{
    //         duration:6000
    //       });
    //     });
      
    //   // sending notification to actions responsibles areas
    //   this.data['redo']['actions'].forEach((element,index) => {

    //     // adding task to action responsible
    //     this.dbs.usersCollection
    //       .doc(element['actionResponsible']['uid'])
    //       .collection(`tasks`)
    //       .doc(this.data['redo']['id'] + `${index}`)
    //       .set(element, {merge: true})
        
    //     // sending notification to action responsible
    //     this.dbs.usersCollection
    //       .doc(element['actionResponsible']['uid'])
    //       .collection(`notifications`)
    //       .add({
    //         regDate: Date.now(),
    //         senderId: this.auth.userCRC.uid,
    //         senderName: this.auth.userCRC.displayName,
    //         redoId: this.data['redo']['id'],
    //         component: this.data['redo']['component'],
    //         OT: this.data['redo']['OT'],
    //         description: this.data['redo']['description'],
    //         responsibleId: element['actionResponsible']['uid'],
    //         responsibleName: element['actionResponsible']['displayName'],
    //         actionStatus: element['status'],
    //         task: element['action'],
    //         status: 'unseen',
    //         type: 'quality redo actions task responsible'
    //       })
    //         .then(ref => {
    //           ref.update({id: ref.id})
    //           this.snackbar.open("Listo!","Cerrar",{
    //             duration: 10000
    //           });
    //         });

        
    //     element['additionalStaff'].forEach(staff => {

    //       // adding task to action responsible
    //       this.dbs.usersCollection
    //         .doc(staff['uid'])
    //         .collection(`tasks`)
    //         .doc(this.data['redo']['id'] + `${index}`)
    //         .set(element, {merge: true})
          
    //       // sending notifications to additional staff
    //       this.dbs.usersCollection
    //         .doc(staff['uid'])
    //         .collection(`notifications`)
    //         .add({
    //           regDate: Date.now(),
    //           senderId: this.auth.userCRC.uid,
    //           senderName: this.auth.userCRC.displayName,
    //           redoId: this.data['redo']['id'],
    //           redo: this.data['redo'],
    //           component: this.data['redo']['component'],
    //           OT: this.data['redo']['OT'],
    //           description: this.data['redo']['description'],
    //           staffId: staff['uid'],
    //           staffName: staff['displayName'],
    //           actionIndex: index,
    //           actionStatus: element['status'],
    //           task: element['action'],
    //           status: 'unseen',
    //           type: 'quality redo actions task staff'
    //         })
    //           .then(ref => {
    //             ref.update({id: ref.id})
    //             this.snackbar.open("Listo!","Cerrar",{
    //               duration: 10000
    //             });
    //           });
    //     })

    //   });
      
    //   // UNDER DEVELOPING
    //   // Adding notifications to Redo's report notification list
    //   // this.qualityRedoReportNotificationList.forEach(element => {
    //   //   this.dbs.usersCollection
    //   //   .doc(element['uid'])
    //   //   .collection(`notifications`)
    //   //   .add({
    //   //     regDate: Date.now(),
    //   //     senderId: this.auth.userCRC.uid,
    //   //     senderName: this.auth.userCRC.displayName,
    //   //     areaSupervisorId: element['uid'],
    //   //     areaSupervisorName: element['displayName'],
    //   //     redoId: reportRef.id,
    //   //     component: this.data['form']['component'],
    //   //     OT: this.data['form']['OT'],
    //   //     description: this.data['form']['description'],
    //   //     status: 'unseen',
    //   //     canUpdate: element['canUpdate'],
    //   //     type: 'quality redo report list'
    //   //   })
    //   //     .then(ref => {
    //   //       ref.update({id: ref.id})
    //   //       this.snackbar.open("Listo!","Cerrar",{
    //   //         duration: 10000
    //   //       });
    //   //     });
    //   // })
    // })
    
  }


}
