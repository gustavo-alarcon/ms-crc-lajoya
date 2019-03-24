import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { MaintenanceRequestsConfirmTaskComponent } from '../maintenance-requests-confirm-task/maintenance-requests-confirm-task.component';

@Component({
  selector: 'app-maintenance-requests-dialog-task',
  templateUrl: './maintenance-requests-dialog-task.component.html',
  styles: []
})
export class MaintenanceRequestsDialogTaskComponent implements OnInit {

  taskFormGroup: FormGroup;

  selectedFile_final = null;
  imageSrc_final: string | ArrayBuffer;

  subscriptions: Array<Subscription> = [];

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
    private dialogRef: MatDialogRef<MaintenanceRequestsDialogTaskComponent>
  ) { }

  ngOnInit() {
    this.createForms();
  }

  createForms(): void{

    this.taskFormGroup = this.fb.group({
      status: this.data['status'],
      maintenanceDetails: this.data['maintenanceDetails'],
    });

    this.imageSrc_final = this.data['finalPicture'];
  }

  showSelectedArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  selectedArea(event): void{
    
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

    if(!this.imageSrc_final){
      this.snackbar.open("Adjunte imagen FINAL para poder guardar el documento","Cerrar", {
        duration: 6000
      });
      return;
    }

    if(this.taskFormGroup.valid){

      let dialogRef = this.dialog.open(MaintenanceRequestsConfirmTaskComponent,{
        data: {
          form: Object.assign(this.data,this.taskFormGroup.value),
          requestId: this.data['id'],
          finalImage: this.selectedFile_final
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
