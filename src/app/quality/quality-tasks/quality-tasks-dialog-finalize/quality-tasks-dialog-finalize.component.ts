import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { QualityTasksConfirmFinalizeComponent } from '../quality-tasks-confirm-finalize/quality-tasks-confirm-finalize.component';

@Component({
  selector: 'app-quality-tasks-dialog-finalize',
  templateUrl: './quality-tasks-dialog-finalize.component.html',
  styles: []
})
export class QualityTasksDialogFinalizeComponent implements OnInit {

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

  selectedFile_6 = null;
  imageSrc_6: string | ArrayBuffer;

  taskFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    private dialogRef: MatDialogRef<QualityTasksDialogFinalizeComponent>,
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

  onFileSelected_2(event): void{
    if(event.target.files[0].type === 'image/png' || event.target.files[0].type === 'image/jpeg'){
      this.selectedFile_2 = event.target.files[0];

      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
  
        const reader = new FileReader();
        reader.onload = e => this.imageSrc_2 = reader.result;
  
        reader.readAsDataURL(file);
      }
    }else{
      this.snackbar.open("Seleccione una imagen en formato png o jpeg","Cerrar", {
        duration: 6000
      })
    }
  }

  onFileSelected_3(event): void{
    if(event.target.files[0].type === 'image/png' || event.target.files[0].type === 'image/jpeg'){
      this.selectedFile_3 = event.target.files[0];

      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
  
        const reader = new FileReader();
        reader.onload = e => this.imageSrc_3 = reader.result;
  
        reader.readAsDataURL(file);
      }
    }else{
      this.snackbar.open("Seleccione una imagen en formato png o jpeg","Cerrar", {
        duration: 6000
      })
    }
  }

  onFileSelected_4(event): void{
    if(event.target.files[0].type === 'application/pdf'){
      this.selectedFile_4 = event.target.files[0];
      console.log(event.target.files[0]);
    }else{
      this.snackbar.open("Seleccione un archivo PDF","Cerrar", {
        duration: 6000
      })
    }
  }

  onFileSelected_5(event): void{
    if(event.target.files[0].type === 'application/pdf'){
      this.selectedFile_5 = event.target.files[0];
    }else{
      this.snackbar.open("Seleccione un archivo PDF","Cerrar", {
        duration: 6000
      })
    }
  }

  onFileSelected_6(event): void{
    if(event.target.files[0].type === 'application/pdf'){
      this.selectedFile_6 = event.target.files[0];

    }else{
      this.snackbar.open("Seleccione un archivo PDF","Cerrar", {
        duration: 6000
      })
    }
  }

  save(): void{
    if(!this.selectedFile_1 && !this.selectedFile_2 && !this.selectedFile_3 && !this.selectedFile_4 && !this.selectedFile_5 && !this.selectedFile_6){
      this.snackbar.open("Tiene que subir por lo menos una imagen o un archivo","Cerrar", {
        duration: 6000
      });
      return;
    }

    this.dialog.open(QualityTasksConfirmFinalizeComponent, {
      data: {
        task: this.data,
        details: this.taskFormGroup.value['details'],
        img1: this.selectedFile_1,
        img2: this.selectedFile_2,
        img3: this.selectedFile_3,
        arch1: this.selectedFile_4,
        arch2: this.selectedFile_5,
        arch3: this.selectedFile_6,
      }
    })

    this.dialogRef.afterClosed().subscribe( res => {
      if(res){
        this.dialogRef.close();
      }
    })
  }
    
  

}
