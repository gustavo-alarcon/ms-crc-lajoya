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

  selectedFile_final = null;
  imageSrc_final: string | ArrayBuffer; 

  statusList: Array<string> = [
    'Por confirmar',
    'Confirmado',
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
  }

  createForms(): void{
    this.taskFormGroup = this.fb.group({
      status: 'Finalizado',
      comments: this.data['comments'],
    });
    
    this.imageSrc_final = this.data['finalPicture'];
  }

  onFileSelected_final(event): void{
    this.selectedFile_final = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_final = reader.result;

      reader.readAsDataURL(file);

      this.taskFormGroup.get('status').setValue('Finalizado');
    }
  }

  save(): void{

    if(!this.imageSrc_final && (this.taskFormGroup.value['status'] === "Finalizado")){
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
          finalImage: this.selectedFile_final,
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