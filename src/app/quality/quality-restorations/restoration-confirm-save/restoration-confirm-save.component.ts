import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-restoration-confirm-save',
  templateUrl: './restoration-confirm-save.component.html',
  styles: []
})
export class RestorationConfirmSaveComponent implements OnInit {

  uploadPercent_1: Observable<number>;
  uploadPercent_2: Observable<number>;
  uploadPercent_3: Observable<number>;
  mergedForms: any;
  uploading_1: string = "";
  uploading_2: string = "";
  uploading_3: string = "";

  constructor(
    public dialogRef: MatDialogRef<RestorationConfirmSaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dbs: DatabaseService,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.mergedForms = Object.assign(this.data[0],this.data[1],this.data[2]);
  }

  save(): void{
    this.uploadDocument();
  }

  uploadDocument(): void{

    this.uploading_1 = "uploading";
    this.uploading_2 = "uploading";
    this.uploading_3 = "uploading";

    const filePath_1 = `/qualityRestorationsRoadmaps/${this.data[3][0].name}`;
    const fileRef_1 = this.storage.ref(filePath_1);
    const task_1 = this.storage.upload(filePath_1, this.data[3][0]);

    const filePath_2 = `/qualityRestorationsDatasheets/${this.data[3][1].name}`;
    const fileRef_2 = this.storage.ref(filePath_2);
    const task_2 = this.storage.upload(filePath_2, this.data[3][1]);

    const filePath_3 = `/qualityRestorationsPictures/${this.data[3][2].name}`;
    const fileRef_3 = this.storage.ref(filePath_3);
    const task_3 = this.storage.upload(filePath_3, this.data[3][2]);

    this.uploadPercent_1 = task_1.percentageChanges();
    this.uploadPercent_2 = task_2.percentageChanges();
    this.uploadPercent_3 = task_3.percentageChanges();

    let lastObject = {
      picture: '',
      datasheet: '',
      roadmap: '',
      regDate: Date.now(),
      createdBy: this.auth.userCRC.name + ', ' + this.auth.userCRC.lastname,
      uid: this.auth.userCRC.uid,
      isTask: false,
      percent: 0
    };

    let finalObject = Object.assign(this.mergedForms,lastObject);

    this.dbs.qualityRedosCollection.add(finalObject).then( ref => {
      ref.update({id: ref.id});

      task_1.snapshotChanges().pipe(
        finalize(() => {
          fileRef_1.getDownloadURL().subscribe(res => {
            if(res){
              this.uploading_1 = "done";
              ref.update({
                roadmap: res
              }).then(() => {
                if(this.uploading_1 === "done" && this.uploading_2 === "done" && this.uploading_3 === "done"){
                  this.dialogRef.close();
                }
              })
            }
          })
        })
      ).subscribe()

      task_2.snapshotChanges().pipe(
        finalize(() => {
          fileRef_2.getDownloadURL().subscribe(res => {
            if(res){
              this.uploading_2 = "done";
              ref.update({
                datasheet: res
              }).then(() => {
                if(this.uploading_1 === "done" && this.uploading_2 === "done" && this.uploading_3 === "done"){
                  this.dialogRef.close();
                }
              })
            }
          })
        })
      ).subscribe()

      task_3.snapshotChanges().pipe(
        finalize(() => {
          fileRef_3.getDownloadURL().subscribe(res => {
            if(res){
              this.uploading_3 = "done";
              ref.update({
                picture: res
              }).then(() => {
                if(this.uploading_1 === "done" && this.uploading_2 === "done" && this.uploading_3 === "done"){
                  this.dialogRef.close();
                }
              })
            }
          })
        })
      ).subscribe()

    }).catch(err => {
      this.snackbar.open(err,"Cerrar",{
        duration: 10000
      });
    })

    
  }

}
