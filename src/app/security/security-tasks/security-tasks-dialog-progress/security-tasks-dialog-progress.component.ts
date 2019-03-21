import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SecurityTasksConfirmSaveComponent } from '../security-tasks-confirm-save/security-tasks-confirm-save.component';

@Component({
  selector: 'app-security-tasks-dialog-progress',
  templateUrl: './security-tasks-dialog-progress.component.html',
  styles: []
})
export class SecurityTasksDialogProgressComponent implements OnInit {

  progressFormGroup: FormGroup;

  selectedFile_final = null;
  imageSrc_final: string | ArrayBuffer

  statusList: Array<string> = [
    'Por confirmar',
    'Confirmado',
    'Rechazado',
    'Finalizado'
  ];

  subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SecurityTasksDialogProgressComponent>
  ) { }

  ngOnInit() {
    this.createForms();
  }
  
  createForms(): void{
    this.progressFormGroup = this.fb.group({
      percent: this.data['task']['percent'],
      description: ''
    });

    this.imageSrc_final = this.data['task']['finalPicture'];
  }

  formatLabel(value: number | null) {
    if(!value){
      return 0;
    }

    return value + '%';
    
  }

  onFileSelected_final(event): void{
    this.selectedFile_final = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_final = reader.result;

      reader.readAsDataURL(file);
    }
  }

  save(): void{

    if(!this.imageSrc_final && this.progressFormGroup.value['percent'] === 100){
      this.snackbar.open("Adjunte imagen FINAL para poder guardar el documento","Cerrar", {
        duration: 6000
      });
      return;
    }

    let dialogRef = this.dialog.open(SecurityTasksConfirmSaveComponent,{
      data: {
        form: this.progressFormGroup.value,
        image: this.selectedFile_final,
        task: this.data['task'],
        type: this.data['type']
      }
      
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.dialogRef.close();
      }
    });

  }
}
