import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { SsggRequestsConfirmTaskComponent } from '../ssgg-requests-confirm-task/ssgg-requests-confirm-task.component';

@Component({
  selector: 'app-ssgg-requests-dialog-task',
  templateUrl: './ssgg-requests-dialog-task.component.html',
  styles: []
})
export class SsggRequestsDialogTaskComponent implements OnInit {

  taskFormGroup: FormGroup;

  selectedFile_1 = null;
  imageSrc_1: string | ArrayBuffer; 
  selectedFile_2 = null;
  imageSrc_2: string | ArrayBuffer; 
  selectedFile_3 = null;
  imageSrc_3: string | ArrayBuffer; 
  selectedFile_4 = null;
  imageSrc_4: string | ArrayBuffer; 
  selectedFile_5 = null;
  imageSrc_5: string | ArrayBuffer; 

  statusList: Array<string> = [
    'Por confirmar',
    'Confirmado',
    'En proceso',
    'Rechazado',
    'Finalizado'
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SsggRequestsDialogTaskComponent>
  ) { }

  ngOnInit() {
    this.createForms();
    console.log(this.data)
  }

  createForms(): void{
    this.taskFormGroup = this.fb.group({
      status: this.data['status'],
      percentage: this.data['percentage'],
      comments: this.data['comments'],
    });
    
    this.imageSrc_1 = this.data['finalPicture1'];
    this.imageSrc_2 = this.data['finalPicture2'];
    this.imageSrc_3 = this.data['finalPicture3'];
    this.imageSrc_4 = this.data['finalPicture4'];
    this.imageSrc_5 = this.data['finalPicture5'];
  }

  onFileSelected_1(event): void{
    this.selectedFile_1 = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_1 = reader.result;

      reader.readAsDataURL(file);

      this.taskFormGroup.get('status').setValue('Finalizado');
    }
  }

  save(): void{

    if(!this.imageSrc_1 && (this.taskFormGroup.value['status'] === "Finalizado")){
      this.snackbar.open("Adjunte imagen FINAL para poder guardar el documento","Cerrar", {
        duration: 6000
      });
      return;
    }

    if(this.taskFormGroup.valid){

      let dialogRef = this.dialog.open(SsggRequestsConfirmTaskComponent,{
        data: {
          form: this.taskFormGroup.value,
          requestId: this.data['id'],
          finalImage: this.selectedFile_1,
          involvedAreas: this.data['involvedAreas']
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if(res){
          this.dialogRef.close(true);
        }
      });

    }else{
      this.snackbar.open("Complete todo los campos requeridos para poder guardar el documento","Cerrar", {
        duration: 6000
      });
    }

  }


}
