import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatAutocomplete, MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { map, startWith } from 'rxjs/operators';
import { QualityRedoReportConfirmAnalyzeComponent } from '../quality-redo-report-confirm-analyze/quality-redo-report-confirm-analyze.component';

@Component({
  selector: 'app-quality-redo-analyze-dialog-edit',
  templateUrl: './quality-redo-analyze-dialog-edit.component.html',
  styles: []
})
export class QualityRedoAnalyzeDialogEditComponent implements OnInit {

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
    private dialogRef: MatDialogRef<QualityRedoAnalyzeDialogEditComponent>
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
      redoType: [this.data['redoType'], [Validators.required]],
      component: this.data['component'],
      componentModel: [this.data['componentModel'], [Validators.required]],
      componentPartNumber: [this.data['componentPartNumber'], [Validators.required]],
      OTSegment: [this.data['OTSegment'], [Validators.required]],
      customer: [this.data['customer'], [Validators.required]],
      repairType: [this.data['repairType'], [Validators.required]],
      hours: [this.data['hours'], [Validators.required]],
      failureMode: [this.data['failureMode'], [Validators.required]],
      rootCause: [this.data['rootCause'], [Validators.required]],
      causeClassification: this.data['causeClassification'],
      involvedAreas: '',
      responsibleStaff: ''
    })

    this.involvedAreasArray = this.data['involvedAreas'].slice();
    this.responsibleStaffArray = this.data['responsibleStaff'].slice();
    
    this.imageSrc_1 = this.data['initialPicture'];
    this.imageSrc_2 = this.data['image_2'];
    this.imageSrc_3 = this.data['image_3'];
    this.imageSrc_4 = this.data['image_4'];
    this.imageSrc_5 = this.data['image_5'];
  }

  // CHIPS INVOLVED AREAS
  addInvolvedArea(event: MatChipInputEvent): void {

    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if(typeof value === 'object'){
        let alreadyExists = this.data['involvedAreas'].filter(option => option['name'].includes(value['name']));
        if(alreadyExists.length === 0){
          this.involvedAreasArray.push(value);
        }else{
          this.snackbar.open("Ya selecciono esta área","Cerrar", {
            duration: 6000
          })
        }
        
      }

      if (input) {
        input.value = '';
      }

      this.analyzeFormGroup.get('involvedAreas').setValue('');
    }
  }

  removeInvolvedArea(area: any): void {
    const index = this.involvedAreasArray.indexOf(area);

    const _index = this.data['involvedAreas'].indexOf(area);
    
    // if(index === _index){
    //   this.snackbar.open("No puede borrar esta área, solo puede agregar nuevas areas.","Cerrar", {
    //     duration: 6000
    //   })
    // }

    if (index >= 0) {
      this.involvedAreasArray.splice(index, 1);
    }
  }

  selectedInvolvedArea(event: MatAutocompleteSelectedEvent): void {
    
    let alreadyExists = this.data['involvedAreas'].filter(option => option['name'].includes(event.option.value['name']));
    
    if(alreadyExists.length === 0){
      this.involvedAreasArray.push(event.option.value);
    }else{
      this.snackbar.open("Ya selecciono esta área","Cerrar", {
        duration: 6000
      });
      return;
    }
    
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
        let alreadyExists = this.data['responsibleStaff'].filter(option => option['uid'].includes(value['uid']));
        if(alreadyExists.length === 0){
          this.responsibleStaffArray.push(value);
        }else{
          this.snackbar.open("Ya selecciono a este usuario","Cerrar", {
            duration: 6000
          })
        }
      }

      if (input) {
        input.value = '';
      }

      this.analyzeFormGroup.get('responsibleStaff').setValue('');
    }
  }

  removeResponsibleStaff(area: any): void {
    const index = this.responsibleStaffArray.indexOf(area);

    if (index >= 0) {
      this.responsibleStaffArray.splice(index, 1);
    }
  }

  selectedResponsibleStaff(event: MatAutocompleteSelectedEvent): void {
    
    let alreadyExists = this.data['responsibleStaff'].filter(option => option['uid'].includes(event.option.value['uid']));
    
    if(alreadyExists.length === 0){
      this.responsibleStaffArray.push(event.option.value);
    }else{
      this.snackbar.open("Ya selecciono a este usuario","Cerrar", {
        duration: 6000
      });
      return;
    }

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
          redo: this.data,
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
