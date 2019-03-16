import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FredConfirmEditComponent } from '../fred-confirm-edit/fred-confirm-edit.component';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-fred-edit-dialog',
  templateUrl: './fred-edit-dialog.component.html',
  styles: []
})
export class FredEditDialogComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  filteredTypes: Observable<any>;
  filteredAreas: Observable<any>;
  filteredStaff: Observable<any>;

  filteredObsList1: Observable<any>;
  filteredObsList2: Observable<any>;
  filteredObsList3: Observable<any>;
  filteredObsList4: Observable<any>;
  filteredObsList5: Observable<any>;

  selectedFile_initial = null;
  selectedFile_final = null;
  imageSrc_initial: string | ArrayBuffer;
  imageSrc_final: string | ArrayBuffer;

  fredTypes: Array<string> = [
    'Acto sub-estandar',
    'Condición sub-estandar',
    'Acto destacable'
  ]

  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // ****************  TAB - FRED
    this.createForms();

    // ------------ FIRST FORM - AUTCOMPLETE DEFINITIONS

    this.filteredTypes = this.firstFormGroup.get('type').valueChanges
                          .pipe(
                            startWith<any>(''),
                            map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                            map(name => name ? this.fredTypes.filter(option => option.toLowerCase().includes(name)) : this.fredTypes)
                          );

    this.filteredAreas = this.firstFormGroup.get('observedArea').valueChanges
                          .pipe(
                            startWith<any>(''),
                            map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                            map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
                          );

    this.filteredStaff = this.firstFormGroup.get('observedStaff').valueChanges
                          .pipe(
                            startWith<any>(''),
                            map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
                            map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
                          )

    // ------------ SECOND FORM - AUTCOMPLETE DEFINITIONS
    this.filteredObsList1 = this.secondFormGroup.get('list1').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                              map(name => name ? this.dbs.substandard1.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.substandard1)
                            );

    this.filteredObsList2 = this.secondFormGroup.get('list2').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                              map(name => name ? this.dbs.substandard2.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.substandard2)
                            );

    this.filteredObsList3 = this.secondFormGroup.get('list3').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                              map(name => name ? this.dbs.substandard3.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.substandard3)
                            );

    this.filteredObsList4 = this.secondFormGroup.get('list4').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                              map(name => name ? this.dbs.substandard4.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.substandard4)
                            );

    this.filteredObsList5 = this.secondFormGroup.get('list5').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                              map(name => name ? this.dbs.substandard5.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.substandard5)
                            );
  }

  ngOnInit() {
  }

  createForms(): void{
    this.firstFormGroup = this.fb.group({
      type: [this.data['type'], [Validators.required]],
      observedArea: [this.data['observedArea'], [Validators.required]],
      observedStaff: [this.data['observedStaff'], [Validators.required]]
    });

    this.secondFormGroup = this.fb.group({
      list1: ['No observado', [Validators.required]],
      list2: ['No observado', [Validators.required]],
      list3: ['No observado', [Validators.required]],
      list4: ['No observado', [Validators.required]],
      list5: ['No observado', [Validators.required]],
    });

    this.data['observations'].forEach(element => {
      if(element['group'] === 'Orden y Limpieza'){
        this.secondFormGroup.get('list1').setValue(element['observations'][0])
      }
      if(element['group'] === 'Equipos de Protección Personal'){
        this.secondFormGroup.get('list2').setValue(element['observations'][0])
      }
      if(element['group'] === 'Control de Riesgos Operacionales'){
        this.secondFormGroup.get('list3').setValue(element['observations'][0])
      }
      if(element['group'] === 'Herramientas y equipos'){
        this.secondFormGroup.get('list4').setValue(element['observations'][0])
      }
      if(element['group'] === 'Riesgos Críticos'){
        this.secondFormGroup.get('list5').setValue(element['observations'][0])
      }
    });

    console.log(this.data['solved'].toString());

    this.thirdFormGroup = this.fb.group({
      solved: this.data['solved'].toString(),
      substandardAct: this.data['substandardAct'],
      substandardCondition: this.data['substandardCondition'],
      remarkableAct: this.data['remarkableAct'],
      upgradeOpportunity: this.data['upgradeOpportunity']
    });

    this.fourthFormGroup = this.fb.group({
      status: this.data['status'],
      percent: this.data['percent'],
      estimatedTerminationDate: this.data['estimatedTerminationDate'],
      realTerminationDate: this.data['realTerminationDate'],
    })

    this.imageSrc_initial = this.data['initialPicture'];
    this.imageSrc_final = this.data['finalPicture'];
  }

  showSelectedStaff(staff): string | undefined {
    return staff? staff['displayName'] : undefined;
  }

  selectedStaff(event): void{
    
  }

  showSelectedArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  selectedArea(event): void{
    
  }

  save(): void{

    if(!this.imageSrc_initial && (this.firstFormGroup.value['type'] === "Condición sub-estandar")){
      this.snackbar.open("Adjunte imagen INICIAL para poder guardar el documento","Cerrar", {
        duration: 6000
      });
      return;
    }

    if(!this.imageSrc_final && (this.fourthFormGroup.value['status'] === "finalizado") && (this.firstFormGroup.value['type'] === "Condición sub-estandar")){
      this.snackbar.open("Adjunte imagen FINAL para poder guardar el documento","Cerrar", {
        duration: 6000
      });
      return;
    }

    if(this.firstFormGroup.valid && this.secondFormGroup.valid){
      if(this.thirdFormGroup.value['solved'] === 'true'){
        this.thirdFormGroup.get('solved').setValue(true);
      }

      if(this.thirdFormGroup.value['solved'] === 'false'){
        this.thirdFormGroup.get('solved').setValue(false);
      }

      if(this.firstFormGroup.value['type'] === "Acto sub-estandar"){
        if( this.secondFormGroup.value['list1'] === 'No observado' &&
            this.secondFormGroup.value['list2'] === 'No observado' &&
            this.secondFormGroup.value['list3'] === 'No observado' &&
            this.secondFormGroup.value['list4'] === 'No observado' &&
            this.secondFormGroup.value['list5'] === 'No observado')
        {
          this.snackbar.open("Debe seleccionar por lo menos una OBSERVACIÓN","Cerrar", {
            duration: 6000
          });

          return;
        }
      }
      
      
      let dialogRef = this.dialog.open(FredConfirmEditComponent,{
        data: [this.firstFormGroup.value, this.secondFormGroup.value, this.thirdFormGroup.value, this.fourthFormGroup.value, this.selectedFile_initial, this.selectedFile_final]
      });

      dialogRef.afterClosed().subscribe(res => {
        if(res){
          this.createForms();
        }
      });

    }else{
      this.snackbar.open("Complete todo los campos requeridos para poder guardar el documento","Cerrar", {
        duration: 6000
      });
    }

  }

  onFileSelected_initial(event): void{
    this.selectedFile_initial = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_initial = reader.result;

      reader.readAsDataURL(file);
    }
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

}
