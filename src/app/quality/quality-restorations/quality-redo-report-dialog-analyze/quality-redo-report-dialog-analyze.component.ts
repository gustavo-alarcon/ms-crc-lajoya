import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatAutocomplete, MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { QualityRedoReportConfirmAnalyzeComponent } from '../quality-redo-report-confirm-analyze/quality-redo-report-confirm-analyze.component';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-quality-redo-report-dialog-analyze',
  templateUrl: './quality-redo-report-dialog-analyze.component.html',
  styles: []
})
export class QualityRedoReportDialogAnalyzeComponent implements OnInit {

  analyzeFormGroup: FormGroup;

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

  filteredQualityRedoTypes: Observable<any>;
  filteredQualityComponents: Observable<any>;
  filteredQualityComponentModels: Observable<any>;
  filteredCustomers: Observable<any>;
  filteredQualityRepairTypes: Observable<any>;
  filteredQualityRootCauses: Observable<any>;
  filteredQualityCauseClassifications: Observable<any>;
  filteredInvolvedAreas: Observable<any>;
  filteredUsers: Observable<any>;

  @ViewChild('involvedAreasInput') involvedAreasInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoInvolvedAreas') matAutocomplete: MatAutocomplete;

  @ViewChild('responsibleStaffInput') responsibleStaffInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoResponsibleStaff') matAutocompleteStaff: MatAutocomplete;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  involvedAreasArray: Array<any> = [];
  responsibleStaffArray: Array<any> = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<QualityRedoReportDialogAnalyzeComponent>
  ) { }

  ngOnInit() {

    this.createForms();

    this.filteredQualityRedoTypes = this.analyzeFormGroup.get('redoType').valueChanges
                                      .pipe(
                                        startWith<any>(''),
                                        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                        map(name => name ? this.dbs.qualityRedoTypes.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.qualityRedoTypes)
                                      );

    this.filteredInvolvedAreas = this.analyzeFormGroup.get('involvedAreas').valueChanges
                                  .pipe(
                                    startWith<any>(''),
                                    map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                    map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
                                  );

    this.filteredQualityComponents =  this.analyzeFormGroup.get('component').valueChanges
                                        .pipe(
                                          startWith<any>(''),
                                          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                          map(name => name ? this.dbs.qualityComponents.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.qualityComponents)
                                        );

    this.filteredQualityComponentModels =  this.analyzeFormGroup.get('componentModel').valueChanges
                                        .pipe(
                                          startWith<any>(''),
                                          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                          map(name => name ? this.dbs.qualityComponentModels.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.qualityComponentModels)
                                        );

    this.filteredQualityRepairTypes =  this.analyzeFormGroup.get('repairType').valueChanges
                                        .pipe(
                                          startWith<any>(''),
                                          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                          map(name => name ? this.dbs.qualityRepairTypes.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.qualityRepairTypes)
                                        );

    this.filteredQualityRootCauses =  this.analyzeFormGroup.get('rootCause').valueChanges
                                        .pipe(
                                          startWith<any>(''),
                                          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                          map(name => name ? this.dbs.qualityRootCauses.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.qualityRootCauses)
                                        );

    this.filteredQualityCauseClassifications =  this.analyzeFormGroup.get('causeClassification').valueChanges
                                                  .pipe(
                                                    startWith<any>(''),
                                                    map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                                    map(name => name ? this.dbs.qualityCauseClassifications.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.qualityCauseClassifications)
                                                  );

    this.filteredCustomers =  this.analyzeFormGroup.get('customer').valueChanges
                                .pipe(
                                  startWith<any>(''),
                                  map(value => typeof value === 'string' ? value.toLowerCase() : value.alias.toLowerCase()),
                                  map(name => name ? this.dbs.customers.filter(option => option['alias'].toLowerCase().includes(name)) : this.dbs.customers)
                                );

    this.filteredUsers =  this.analyzeFormGroup.get('responsibleStaff').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
                              map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
                            );

  }

  createForms(): void{
    this.analyzeFormGroup = this.fb.group({
      redoType: ['', [Validators.required]],
      component: this.data['report']['component'],
      componentModel: ['', [Validators.required]],
      componentPartNumber: ['', [Validators.required]],
      OTSegment: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      repairType: ['', [Validators.required]],
      hours: ['', [Validators.required]],
      failureMode: ['', [Validators.required]],
      rootCause: ['', [Validators.required]],
      causeClassification: '',
      involvedAreas: '',
      responsibleStaff: '',
    })
    
    this.imageSrc_1 = this.data['report']['initialPicture'];
  }

  // CHIPS INVOLVED AREAS
  addInvolvedArea(event: MatChipInputEvent): void {

    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if(typeof value === 'object'){
        this.involvedAreasArray.push(value);
      }

      if (input) {
        input.value = '';
      }

      this.analyzeFormGroup.get('involvedAreas').setValue('');
    }
  }

  removeInvolvedArea(area: any): void {
    const index = this.involvedAreasArray.indexOf(area);

    if (index >= 0) {
      this.involvedAreasArray.splice(index, 1);
    }
  }

  selectedInvolvedArea(event: MatAutocompleteSelectedEvent): void {
    this.involvedAreasArray.push(event.option.value);
    this.involvedAreasInput.nativeElement.value = '';
    this.analyzeFormGroup.get('involvedAreas').setValue(' ');
  }
  //  *********************************************************

  // CHIPS RESPONSIBLE STAFF
  addResponsibleStaff(event: MatChipInputEvent): void {

    if (!this.matAutocompleteStaff.isOpen) {
      const input = event.input;
      const value = event.value;

      if(typeof value === 'object'){
        this.responsibleStaffArray.push(value);
      }

      if (input) {
        input.value = '';
      }

      this.analyzeFormGroup.get('responsibleStaff').setValue('');
    }
  }

  removeresponsibleStaff(area: any): void {
    const index = this.responsibleStaffArray.indexOf(area);

    if (index >= 0) {
      this.responsibleStaffArray.splice(index, 1);
    }
  }

  selectedResponsibleStaff(event: MatAutocompleteSelectedEvent): void {
    this.responsibleStaffArray.push(event.option.value);
    this.responsibleStaffInput.nativeElement.value = '';
    this.analyzeFormGroup.get('responsibleStaff').setValue(' ');
  }
  //  *********************************************************

  showSelectedArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  showSelectedCustomer(customer): string | undefined {
    return customer? customer['fullName'] : undefined;
  }

  onFileSelected_1(event): void{
    this.selectedFile_1 = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_1 = reader.result;

      reader.readAsDataURL(file);
    }
  }

  onFileSelected_2(event): void{
    this.selectedFile_2 = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_2 = reader.result;

      reader.readAsDataURL(file);
    }
  }

  onFileSelected_3(event): void{
    this.selectedFile_3 = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_3 = reader.result;

      reader.readAsDataURL(file);
    }
  }

  onFileSelected_4(event): void{
    this.selectedFile_4 = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_4 = reader.result;

      reader.readAsDataURL(file);
    }
  }

  onFileSelected_5(event): void{
    this.selectedFile_5 = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_5 = reader.result;

      reader.readAsDataURL(file);
    }
  }

  save(): void{
    console.log(this.analyzeFormGroup);

    if(this.analyzeFormGroup.valid){

      if(this.involvedAreasArray.length === 0){
        this.snackbar.open("Seleccione por lo menos un área responsable","Cerrar", {
          duration: 6000
        });
        return;
      }

      if(this.responsibleStaffArray.length === 0){
        this.snackbar.open("Seleccione por lo menos a una persona responsable","Cerrar", {
          duration: 6000
        });
        return;
      }

      if(this.analyzeFormGroup.value['rootCause'] === 'Procedimientos' && this.analyzeFormGroup.value['causeClassification'] === ''){
        this.snackbar.open("Debe elegir una clasificación de causa raíz","Cerrar", {
          duration: 6000
        });
        return;
      }

      let dialogRef = this.dialog.open(QualityRedoReportConfirmAnalyzeComponent,{
        data: {
          form: this.analyzeFormGroup.value,
          redo: this.data['report'],
          involvedAreas: this.involvedAreasArray,
          responsibleStaff: this.responsibleStaffArray,
          initialImage: this.selectedFile_1,
          image_2: this.selectedFile_2,
          image_3: this.selectedFile_3,
          image_4: this.selectedFile_4,
          image_5: this.selectedFile_5,
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if(res){
          this.dialogRef.close(res);
        }
      });

    }else{
      this.snackbar.open("Complete todo los campos requeridos para poder guardar el documento","Cerrar", {
        duration: 6000
      });
    }

  }

}
