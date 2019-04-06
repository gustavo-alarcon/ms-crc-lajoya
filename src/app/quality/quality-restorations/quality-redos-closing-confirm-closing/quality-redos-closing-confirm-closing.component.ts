import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-quality-redos-closing-confirm-closing',
  templateUrl: './quality-redos-closing-confirm-closing.component.html',
  styles: []
})
export class QualityRedosClosingConfirmClosingComponent implements OnInit {

  uploading: boolean = false;

  selectedFile = null;
  uploadPercent: Observable<number>;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: AngularFireStorage,
    public dialogRef: MatDialogRef<QualityRedosClosingConfirmClosingComponent>,
  ) { }

  ngOnInit() {
  }

  onFileSelected(event): void{
    if(event.target.files[0].type === 'application/pdf'){
      this.selectedFile = event.target.files[0];
      console.log(event.target.files[0]);
    }else{
      this.snackbar.open("Seleccione un archivo PDF","Cerrar", {
        duration: 6000
      })
    }
  }

  save(): void{

    if(this.selectedFile){

      this.dbs.qualityRedosCollection.doc(this.data['id']).update({stage: 'Finalizado'})

      this.uploading = true;

      const filePath = `/qualityRedosFinalReport/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);

      this.uploadPercent = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( res => {
            if(res){
      
              this.dbs.qualityRedosCollection.doc(this.data['id']).set({finalReport: res},{merge: true}).then(() => {

                // Creating log object
                let log = {
                  action: 'Final report uploaded!',
                  data: res,
                  regdate: Date.now()
                }
                
                // Adding log to redo
                this.dbs.addQualityRedoLog(this.data['id'], log)
                  .then(() => {
                    this.dialogRef.close(true);
                    this.uploading = false;
                  })
                  .catch(error => {
                    console.log(error);
                    this.uploading = false;
                    this.snackbar.open("Ups!, parece que hubo un error gurdando el log ...","Cerrar",{
                      duration:6000
                    });
                  });

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
    }else{
      this.snackbar.open("Tiene que adjuntar el informe final para poder cerrar el rehacer","Cerrar",{
        duration: 6000
      })
    }
  }

}
