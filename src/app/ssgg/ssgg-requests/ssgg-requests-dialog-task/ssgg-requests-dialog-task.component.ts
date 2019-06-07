import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef, MatFormFieldControl } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { SsggRequestsConfirmTaskComponent } from '../ssgg-requests-confirm-task/ssgg-requests-confirm-task.component';
import { debounce, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-ssgg-requests-dialog-task',
  templateUrl: './ssgg-requests-dialog-task.component.html',
  styles: []
})
export class SsggRequestsDialogTaskComponent implements OnInit {

  taskFormGroup: FormGroup;

  selectedFile_final1 = null;
  imageSrc_final1: string | ArrayBuffer;

  selectedFile_final2 = null;
  imageSrc_final2: string | ArrayBuffer;

  selectedFile_final3 = null;
  imageSrc_final3: string | ArrayBuffer;

  selectedFile_final4 = null;
  imageSrc_final4: string | ArrayBuffer;

  statusList: Array<string> = [
    'Por confirmar',
    'Confirmado',
    'Rechazado',
    'En proceso',
    'Finalizado'
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SsggRequestsDialogTaskComponent>,
  ) { }

  ngOnInit() {
    this.createForms();

    this.taskFormGroup.get('percentage').valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(res => {
        if (res === 100) {
          this.taskFormGroup.get('status').setValue('Finalizado');
        } else {
          this.taskFormGroup.get('status').setValue('En proceso');
        }
      });
  }

  createForms(): void {
    this.taskFormGroup = this.fb.group({
      status: [this.data['status'], [Validators.required]],
      comments: [this.data['comments'], [Validators.required]],
      percentage: [this.data['percentage'], [Validators.required]]
    });

    this.imageSrc_final1 = this.data['finalPicture1'];
    this.imageSrc_final2 = this.data['finalPicture2'];
    this.imageSrc_final3 = this.data['finalPicture3'];
    this.imageSrc_final4 = this.data['finalPicture4'];
  }

  onFileSelected_final1(event): void {
    this.selectedFile_final1 = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_final1 = reader.result;

      reader.readAsDataURL(file);
    }
  }

  onFileSelected_final2(event): void {
    this.selectedFile_final2 = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_final2 = reader.result;

      reader.readAsDataURL(file);
    }
  }

  onFileSelected_final3(event): void {
    this.selectedFile_final3 = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_final3 = reader.result;

      reader.readAsDataURL(file);
    }
  }

  onFileSelected_final4(event): void {
    this.selectedFile_final4 = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_final4 = reader.result;

      reader.readAsDataURL(file);
    }
  }

  save(): void {
    let imgCounter = 0;

    if (!!this.imageSrc_final1) {
      imgCounter++;
    }

    if (!!this.imageSrc_final2) {
      imgCounter++;
    }

    if (!!this.imageSrc_final3) {
      imgCounter++;
    }

    if (!!this.imageSrc_final4) {
      imgCounter++;
    }

    if (imgCounter === 0) {
      this.snackbar.open('Adjunte por lo menos una imagen para actualizar la solicitud', 'Cerrar', {
        duration: 6000
      });
      return;
    }

    if (this.taskFormGroup.valid) {

      const dialogRef = this.dialog.open(SsggRequestsConfirmTaskComponent, {
        data: {
          form: this.taskFormGroup.value,
          request: this.data,
          finalImage1: this.selectedFile_final1,
          finalImage2: this.selectedFile_final2,
          finalImage3: this.selectedFile_final3,
          finalImage4: this.selectedFile_final4
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.dialogRef.close(true);
        }
      });

    } else {
      this.snackbar.open('Complete todo los campos requeridos para poder guardar la solicitud', 'Cerrar', {
        duration: 6000
      });
    }

  }


}
