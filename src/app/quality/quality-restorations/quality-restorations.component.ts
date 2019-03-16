import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { RestorationConfirmSaveComponent } from './restoration-confirm-save/restoration-confirm-save.component';

@Component({
  selector: 'app-quality-restorations',
  templateUrl: './quality-restorations.component.html',
  styles: []
})
export class QualityRestorationsComponent implements OnInit {

  firstFormGroup:   FormGroup;
  secondFormGroup:  FormGroup;
  thirdFormGroup:   FormGroup;

  supervisors: Array<any> = ['Supervisor 1', 'Supervisor 2', 'Supervisor 3'];
  howTos: Array<any> = ['RHI', 'Consesión del cliente (interno/externo)', 'Ampliación', 'En la misma OT', 'GAR', 'Otros'];

  responsibles: Array<any> = [
    {name: 'Juan', lastname: 'Delgado'},
    {name: 'Luis', lastname: 'Perez'},
    {name: 'Fernando', lastname: 'Colana'}
  ];

  areaSupervisors: Array<any> = [
    {name: 'Juan', lastname: 'Delgado'},
    {name: 'Luis', lastname: 'Perez'},
    {name: 'Fernando', lastname: 'Colana'}
  ];

  selectedFile_1 = null;
  selectedFile_2 = null;
  selectedFile_3 = null;

  constructor(
    private fb: FormBuilder,
    public snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {

    this.firstFormGroup = this.fb.group({
      event: ['', Validators.required],
      howToSolve: ['', Validators.required],
      solveDescription: ['', Validators.required],
      OT: false,
      whoAuthorizedOT: [{value: '', disabled: true}]
    });

    this.secondFormGroup = this.fb.group({
      regMRMC: ['', Validators.required],
      regOTCustomer: ['', Validators.required],
      regOTRHI: [''],
      regPartNumber: ['', Validators.required],
      componentName:['', Validators.required]
    });

    this.thirdFormGroup = this.fb.group({
      where: ['', Validators.required],
      responsible: ['', Validators.required],
      areaSupervisor: ['', Validators.required]
    })

    this.firstFormGroup.get('OT').valueChanges.subscribe( res => {
      if(res){
        this.firstFormGroup.get('whoAuthorizedOT').enable();
      }else{
        this.firstFormGroup.get('whoAuthorizedOT').disable();
      }
    })

  }

  showSelectedResponsible(responsible): string | undefined {
    return responsible? responsible['name'] + ', ' + responsible['lastname'] : undefined;
  }

  selectedResponsible(event): void{

  }

  showSelectedAreaSupervisor(areaSupervisor): string | undefined {
    return areaSupervisor? areaSupervisor['name'] + ', ' + areaSupervisor['lastname'] : undefined;
  }

  selectedAreaSupervisor(event): void{

  }

  save(): void{
    if(!this.selectedFile_3){
      this.snackbar.open("Adjunte una imagen para poder guardar el documento","Cerrar", {
        duration: 6000
      })
      return;
    }

    if(this.firstFormGroup.valid && this.secondFormGroup.valid){
      this.dialog.open(RestorationConfirmSaveComponent,{
        data: [this.firstFormGroup.value, this.secondFormGroup.value, this.thirdFormGroup.value, [this.selectedFile_1, this.selectedFile_2, this.selectedFile_3]]
      });
    }else{
      this.snackbar.open("Complete todo los campos requeridos para poder guardar el documento","Cerrar", {
        duration: 6000
      });
    }
  }

  saveAsTask(): void{

  }

  onFile1Selected(event): void{
    if(event.target.files[0].type === 'application/pdf'){
      this.selectedFile_1 = event.target.files[0];
    }else{
      this.snackbar.open("Seleccione un archivo PDF","Cerrar",{
        duration: 6000
      });
    }
  }

  onFile2Selected(event): void{
    if(event.target.files[0].type === 'application/pdf'){
      this.selectedFile_2 = event.target.files[0];
    }else{
      this.snackbar.open("Seleccione un archivo PDF","Cerrar",{
        duration: 6000
      });
    }
  }

  onFile3Selected(event): void{
    if(event.target.files[0].type === 'image/png' || event.target.files[0].type === 'image/jpeg'){
      this.selectedFile_3 = event.target.files[0];
    }else{
      this.snackbar.open("Seleccione una imagen","Cerrar",{
        duration: 6000
      });
    }
  }

}
