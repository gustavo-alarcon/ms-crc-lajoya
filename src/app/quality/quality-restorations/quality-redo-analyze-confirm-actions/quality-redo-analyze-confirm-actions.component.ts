import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-quality-redo-analyze-confirm-actions',
  templateUrl: './quality-redo-analyze-confirm-actions.component.html',
  styles: []
})
export class QualityRedoAnalyzeConfirmActionsComponent implements OnInit {

  uploading: boolean = false;

  reportObject: object;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialogRef: MatDialogRef<QualityRedoAnalyzeConfirmActionsComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  save(): void {

    this.uploading = true;

    this.reportObject = {
      actionsDate: Date.now(),
      stage: 'Acciones',
      upgradedToActionsBy: this.auth.userCRC,
      uidActionsUpgrader: this.auth.userCRC.uid
    };

    this.data['actions'].forEach(element => {
      // adding action to respective redo as collection
      this.dbs.qualityRedosCollection.doc(this.data['redo']['id']).collection('actions').add(element)
        .then(ref => {
          ref.update({ id: ref.id, regDate: Date.now() })
        })
      
      // send notification to responsibles
      // this.dbs.usersCollection
      //   .doc(element['actionResponsibles'][0]['uid'])
      //   .collection('notifications')
      //   .add({
      //     regDate: Date.now(),
      //     senderId: this.auth.userCRC.uid,
      //     senderName: this.auth.userCRC.displayName,
      //     redoId: this.data['redo']['id'],
      //     component: this.data['redo']['component'],
      //     OT: this.data['redo']['OT'],
      //     description: this.data['redo']['description'],
      //     actionStatus: 'Confirmado',
      //     status: 'unseen',
      //     type: 'quality redo actions task validated'
      //   })
      //   .then(ref => {
      //     ref.update({ id: ref.id })
      //   })
      //   .catch(error => {
      //     console.log(error);
      //     this.uploading = false;
      //     this.snackbar.open("Ups!, parece que hubo un error enviando la notificación al responsable de la tarea...", "Cerrar", {
      //       duration: 6000
      //     });
      //   });
    })

    this.dbs.qualityRedosCollection.doc(this.data['redo']['id']).set(this.reportObject, { merge: true }).then(() => {

      // Creating log object
      let log = {
        action: 'Analyze upgraded to actions!',
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
          this.snackbar.open("Ups!, parece que hubo un error (MR001) ...", "Cerrar", {
            duration: 6000
          });
        });

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
          type: 'quality redo actions supervisor'
        })
        .then(ref => {
          ref.update({ id: ref.id })
          this.snackbar.open("Listo!", "Cerrar", {
            duration: 10000
          });
        });

      // sending notification to involved areas
      this.data['redo']['involvedAreas'].forEach(element => {
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
            type: 'quality redo actions involved supervisor'
          })
          .then(ref => {
            ref.update({ id: ref.id })
            this.snackbar.open("Listo!", "Cerrar", {
              duration: 10000
            });
          });
      });

      // sending notifications to responsible staff
      this.data['redo']['responsibleStaff'].forEach(element => {
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
            type: 'quality redo actions responsible staff'
          })
          .then(ref => {
            ref.update({ id: ref.id })
            this.snackbar.open("Listo!", "Cerrar", {
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

    })

  }
}
