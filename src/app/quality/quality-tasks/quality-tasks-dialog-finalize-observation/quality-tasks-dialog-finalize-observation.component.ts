import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { QualityTasksConfirmFinalizeObservationComponent } from '../quality-tasks-confirm-finalize-observation/quality-tasks-confirm-finalize-observation.component';

@Component({
  selector: 'app-quality-tasks-dialog-finalize-observation',
  templateUrl: './quality-tasks-dialog-finalize-observation.component.html',
  styles: []
})
export class QualityTasksDialogFinalizeObservationComponent implements OnInit {

  selectedFile_1 = null;
  imageSrc_1: string | ArrayBuffer;

  taskFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    private dialogRef: MatDialogRef<QualityTasksDialogFinalizeObservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.createForms();
  }

  createForms(): void{
    this.taskFormGroup = this.fb.group({
      details: ''
    })
  }

  onFileSelected_1(event): void{
    if(event.target.files[0].type === 'image/png' || event.target.files[0].type === 'image/jpeg'){
      this.selectedFile_1 = event.target.files[0];

      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
  
        const reader = new FileReader();
        reader.onload = e => this.imageSrc_1 = reader.result;
  
        reader.readAsDataURL(file);
      }
    }else{
      this.snackbar.open("Seleccione una imagen en formato png o jpeg","Cerrar", {
        duration: 6000
      })
    }
  }

  save(): void{
    if(!this.selectedFile_1){
      this.snackbar.open("Tiene que subir una imagen para poder finalizar la tarea","Cerrar", {
        duration: 6000
      });
      return;
    }

    let dialog = this.dialog.open(QualityTasksConfirmFinalizeObservationComponent, {
      data: {
        task: this.data,
        details: this.taskFormGroup.value['details'],
        img1: this.selectedFile_1
      }
    })

    dialog.afterClosed().subscribe( res => {
      if(res){
        this.dialogRef.close(true);
      }
    })
  }

}
