import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { map, startWith } from 'rxjs/operators';
import { QualityRedoReportConfirmEditComponent } from '../quality-redo-report-confirm-edit/quality-redo-report-confirm-edit.component';

@Component({
  selector: 'app-quality-redo-report-dialog-edit',
  templateUrl: './quality-redo-report-dialog-edit.component.html',
  styles: []
})
export class QualityRedoReportDialogEditComponent implements OnInit {

  reportFormGroup: FormGroup;

  selectedFile_initial = null;
  imageSrc_initial: string | ArrayBuffer;

  filteredQualityComponents: Observable<any>;
  filteredAreas: Observable<any>;
  filteredStatusList: Observable<any>;

  subscriptions: Array<Subscription> = [];

  statusList: Array<string> = [
    'Por confirmar',
    'Confirmado',
    'Rechazado'
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    private dialogRef: MatDialogRef<QualityRedoReportDialogEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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

    this.filteredStatusList =  this.reportFormGroup.get('status').valueChanges
                                .pipe(
                                  startWith<any>(''),
                                  map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                  map(name => name ? this.statusList.filter(option => option.toLowerCase().includes(name)) : this.statusList)
                                );
  }

  createForms(): void{
    this.reportFormGroup = this.fb.group({
      OT: [this.data['report']['OT'], [Validators.required]],
      component: [this.data['report']['component'], [Validators.required]],
      description: [this.data['report']['description'], [Validators.required]],
      area: [this.data['report']['area'], [Validators.required]],
      status: [this.data['report']['status'], [Validators.required]]
    });

    this.imageSrc_initial = this.data['report']['initialPicture'];
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
      this.snackbar.open("Adjunte imagen para poder guardar el documento","Cerrar", {
        duration: 6000
      });
      return;
    }

    if(this.reportFormGroup.valid){

      let dialogRef = this.dialog.open(QualityRedoReportConfirmEditComponent,{
        data: {
          form: this.reportFormGroup.value,
          initialImage: this.selectedFile_initial,
          reportId: this.data['report']['id']
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
