import { Component, OnInit, Inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { startWith, map } from 'rxjs/operators';
import { QualityRedoReportConfirmCreateComponent } from '../quality-redo-report-confirm-create/quality-redo-report-confirm-create.component';

@Component({
  selector: 'app-quality-redo-report-dialog-create',
  templateUrl: './quality-redo-report-dialog-create.component.html',
  styles: []
})
export class QualityRedoReportDialogCreateComponent implements OnInit {

  reportFormGroup: FormGroup;

  selectedFile_initial = null;
  imageSrc_initial: string | ArrayBuffer;

  filteredQualityComponents: Observable<any>;
  filteredAreas: Observable<any>;

  subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    private dialogRef: MatDialogRef<QualityRedoReportDialogCreateComponent>
  ) { }

  ngOnInit() {

    this.createForms();

    this.filteredQualityComponents =  this.reportFormGroup.get('component').valueChanges
                                            .pipe(
                                              startWith<any>(''),
                                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                              map(name => name ? this.dbs.qualityComponents.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.qualityComponents)
                                            );

    this.filteredAreas =  this.reportFormGroup.get('area').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                              map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
                            );
  }

  createForms(): void{
    this.reportFormGroup = this.fb.group({
      OT: ['', [Validators.required]],
      component: ['', [Validators.required]],
      description: ['', [Validators.required]],
      area: ['', [Validators.required]]
    });
  }

  showSelectedArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  selectedArea(event): void{
    
  }

  onFileSelected(event): void{
    this.selectedFile_initial = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_initial = reader.result;

      reader.readAsDataURL(file);
    }
  }

  save(): void{

    if(!this.imageSrc_initial){
      this.snackbar.open("Adjunte imagen para poder crear el reporte","Cerrar", {
        duration: 6000
      });
      return;
    }

    if(this.reportFormGroup.valid){

      let dialogRef = this.dialog.open(QualityRedoReportConfirmCreateComponent,{
        data: {
          form: this.reportFormGroup.value,
          initialImage: this.selectedFile_initial
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
