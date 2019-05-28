import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-quality-redos-actions-confirm-request-closing',
  templateUrl: './quality-redos-actions-confirm-request-closing.component.html',
  styles: []
})
export class QualityRedosActionsConfirmRequestClosingComponent implements OnInit {

  uploading: boolean = false;

  filteredList: Array<any> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialogRef: MatDialogRef<QualityRedosActionsConfirmRequestClosingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.data['confirmationList'].forEach(element => {
      let index = this.filteredList.map(e => {return e['uid']}).indexOf(element['uid']);
      if(index === -1){
        this.filteredList.push(element)
      }
    })
  }

  save(): void{
    this.uploading = true;

    this.filteredList.forEach(user => {
      this.dbs.qualityRedosCollection
      .doc(this.data['redo']['id'])
      .collection('signing')
      .doc(user['uid'])
      .set(user)
        .then(() => {
          // adding notification to users
          this.dbs.usersCollection
          .doc(user['uid'])
          .collection('notifications')
          .add({
            regDate: Date.now(),
            senderId: this.auth.userCRC.uid,
            senderName: this.auth.userCRC.displayName,
            redoId: this.data['redo']['id'],
            signId: user['uid'],
            component: this.data['redo']['component'],
            OT: this.data['redo']['OT'],
            description: this.data['redo']['description'],
            requestStatus: 'Por confirmar',
            status: 'unseen',
            type: 'quality redo actions request closing'
          })
          .then(ref => {
            ref.update({id: ref.id})
          })
        })
        .catch(err => {
          console.log(err);
          this.snackbar.open("Ups!, parece que hubo un error enviando las confirmaciones ...","Cerrar",{
            duration:6000
          });
        })
    })

    this.dbs.qualityRedosCollection
      .doc(this.data['redo']['id'])
      .set({
        stage: 'Cierre',
        requestDate: Date.now(),
        upgradedToClosingBy: this.auth.userCRC,
        uidClosingUpgrader: this.auth.userCRC.uid
      },{merge:true}).
        then(() => {
          // Creating log object
          let log = {
            action: 'actions upgraded to closing!',
            data: this.filteredList,
            user: this.auth.userCRC,
            regdate: Date.now()
          }
          
          // Adding log to redo
          this.dbs.addQualityRedoLog(this.data['redo']['id'], log)
            .then(() => {
              this.dialogRef.close(true);
              this.uploading = false;
            })
            .catch(error => {
              console.log(error);
              this.uploading = false;
              this.snackbar.open("Ups!, parece que hubo un error registrando el log ...","Cerrar",{
                duration:6000
              });
            });
        })
        .catch(err => {
          console.log(err);
          this.uploading = false;
          this.snackbar.open("Ups!, parece que hubo un error actualizando el redo ...","Cerrar",{
            duration:6000
          });
        })

  }

}
