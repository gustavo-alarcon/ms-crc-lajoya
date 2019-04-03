import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-quality-redo-actions-dialog-request-closing',
  templateUrl: './quality-redo-actions-dialog-request-closing.component.html',
  styles: []
})
export class QualityRedoActionsDialogRequestClosingComponent implements OnInit {

  uploading: boolean = false;

  actionsArray: Array<any> = [];
  
  subcription: Array<Subscription> = [];

  signingArray: Array<any> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dbs: DatabaseService,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    public dialog: MatDialogRef<QualityRedoActionsDialogRequestClosingComponent>,
    public af: AngularFirestore

  ) { }

  ngOnInit() {
    let actionsListSubs = this.dbs.qualityRedosCollection
                            .doc(this.data['redo']['id'])
                            .collection('actions')
                            .valueChanges()
                            .subscribe(res => {
                              this.actionsArray = res;
                            })
  }

  prepareCollection(): void{
    this.dbs.qualityRedosCollection
    .doc(this.data['redo']['id'])
    .collection('signing')
    .get().forEach(snap => {
      this.signingArray = snap.docs;
    })

    this.signingArray.forEach(doc => {
      this.af.doc(doc.ref.path).delete();
      this.dbs.usersCollection.doc(this.auth.userCRC.uid).collection('notifications').doc(doc.ref.id).delete();
    })
  }

  request(): void{

    

    this.dbs.qualityRedosCollection
      .doc(this.data['redo']['id'])
      .collection('signing')
      .add({signed: false, user: this.data['redo']['area']['supervisor']})
        .then(ref => {
          ref.update({id: ref.id})
          // adding notification to main area supervisor
          this.dbs.usersCollection
          .doc(this.data['redo']['area']['supervisor']['uid'])
          .collection('notifications')
          .add({
            regDate: Date.now(),
            senderId: this.auth.userCRC.uid,
            senderName: this.auth.userCRC.displayName,
            redoId: this.data['redo']['id'],
            signId: ref.id,
            component: this.data['redo']['component'],
            OT: this.data['redo']['OT'],
            description: this.data['redo']['description'],
            kind: 'Supervisor de área principal',
            requestStatus: 'Por confirmar',
            status: 'unseen',
            type: 'quality redo actions request closing'
          })
            .then(ref => {
              ref.update({id: ref.id})
              this.dialog.close(true);
              this.snackbar.open("Listo!","Cerrar", {
                duration: 6000
              })
            })
            .catch(error => {
              console.log(error);
              this.uploading = false;
              this.snackbar.open("Ups!, parece que hubo un error enviando la notificación al supervisor área principal...","Cerrar",{
                duration:6000
              });
            });
        })

    

    this.data['redo']['involvedAreas'].forEach(element => {
      this.dbs.qualityRedosCollection
        .doc(this.data['redo']['id'])
        .collection('signing')
        .add({signed: false, user: element})
          .then(ref => {
            ref.update({id: ref.id})
            // adding notification to involved areas
            this.dbs.usersCollection
            .doc(element['supervisor']['uid'])
            .collection('notifications')
            .add({
              regDate: Date.now(),
              senderId: this.auth.userCRC.uid,
              senderName: this.auth.userCRC.displayName,
              redoId: this.data['redo']['id'],
              signId: ref.id,
              component: this.data['redo']['component'],
              OT: this.data['redo']['OT'],
              description: this.data['redo']['description'],
              kind: 'Supervisor de área involucrada',
              requestStatus: 'Por confirmar',
              status: 'unseen',
              type: 'quality redo actions request closing'
            })
              .then(ref => {
                ref.update({id: ref.id})
              })
              .catch(error => {
                console.log(error);
                this.uploading = false;
                this.snackbar.open("Ups!, parece que hubo un error enviando la notificación al supervisor área involucrada...","Cerrar",{
                  duration:6000
                });
              });
          })
      
    });

    this.data['redo']['responsibleStaff'].forEach(element => {
      this.dbs.qualityRedosCollection
        .doc(this.data['redo']['id'])
        .collection('signing')
        .add({signed: false, user: element})
          .then(ref => {
            ref.update({id: ref.id})
            // adding notification to responsible staff
            this.dbs.usersCollection
            .doc(element['uid'])
            .collection('notifications')
            .add({
              regDate: Date.now(),
              senderId: this.auth.userCRC.uid,
              senderName: this.auth.userCRC.displayName,
              redoId: this.data['redo']['id'],
              signId: ref.id,
              component: this.data['redo']['component'],
              OT: this.data['redo']['OT'],
              description: this.data['redo']['description'],
              kind: 'Personal responsable',
              requestStatus: 'Por confirmar',
              status: 'unseen',
              type: 'quality redo actions request closing'
            })
              .then(ref => {
                ref.update({id: ref.id})
              })
              .catch(error => {
                console.log(error);
                this.uploading = false;
                this.snackbar.open("Ups!, parece que hubo un error enviando la notificación al supervisor área involucrada...","Cerrar",{
                  duration:6000
                });
              });
          })

      
    });

    this.actionsArray.forEach(element => {
      this.dbs.qualityRedosCollection
        .doc(this.data['redo']['id'])
        .collection('signing')
        .add({signed: false, user: element['actionResponsible']})
          .then(ref => {
            ref.update({id: ref.id})
            // adding notification to involved areas
            this.dbs.usersCollection
            .doc(element['actionResponsible']['uid'])
            .collection('notifications')
            .add({
              regDate: Date.now(),
              senderId: this.auth.userCRC.uid,
              senderName: this.auth.userCRC.displayName,
              redoId: this.data['redo']['id'],
              signId: ref.id,
              component: this.data['redo']['component'],
              OT: this.data['redo']['OT'],
              description: this.data['redo']['description'],
              requestStatus: 'Por confirmar',
              kind: 'Responsable de tarea - ' + element['action'],
              status: 'unseen',
              type: 'quality redo actions request closing'
            })
              .then(ref => {
                ref.update({id: ref.id})
              })
              .catch(error => {
                console.log(error);
                this.uploading = false;
                this.snackbar.open("Ups!, parece que hubo un error enviando la notificación al supervisor área involucrada...","Cerrar",{
                  duration:6000
                });
              });
          })

      
    });


  }

}
