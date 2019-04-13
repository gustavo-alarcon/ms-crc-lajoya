import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-create-new-permit',
  templateUrl: './create-new-permit.component.html',
  styles: []
})
export class CreateNewPermitComponent implements OnInit {
  
  loading: boolean = false;
  coincidence: boolean = false;

  detailsFormGroup: FormGroup;
  permitsConfigurationFormGroup: FormGroup;

  securitySelection = new SelectionModel<any>(true, []);
  securityKeys: Array<any> = [
    {name:'FRED', value:'securityFred'},
    {name:'Formulario FRED', value:'securityFredForm'},
    {name:'Lista general FRED', value:'securityFredGeneralList'},
    {name:'Lista personal FRED', value:'securityFredPersonalList'},
    {name:'Editar FRED', value:'securityFredEdit'},
    {name:'Eliminar FRED', value:'securityFredDelete'},
    {name:'Inspecciones', value:'securityInspections'},
    {name:'Cronograma de Inspecciones', value:'securityInspectionsCrono'},
    {name:'Lista general de Inspecciones', value:'securityInspectionsGeneralList'},
    {name:'Lista personal de Inspecciones', value:'securityInspectionsPersonalList'},
    {name:'Editar Inspecciones', value:'securityInspectionsEdit'},
    {name:'Eliminar Inspecciones', value:'securityInspectionsDelete'},
    {name:'Tareas', value:'securityTasks'},
    {name:'Lista general de Tareas', value:'securityTasksGeneralList'},
    {name:'Lista personal de Tareas', value:'securityTasksPersonalList'},
    {name:'Editar Tareas', value:'securityTasksEdit'},
    {name:'Eliminar Tareas', value:'securityTasksDelete'},
  ];

  qualitySelection = new SelectionModel<any>(true, []);
  qualityKeys: Array<any> = [
    {name:'Rehaceres', value:'qualityRedos'},
    {name:'Lista general de Rehaceres',value:'qualityRedosGeneralList'},
    {name:'Lista personal de Rehaceres',value:'qualityRedosPersonalList'},
    {name:'Editar Rehaceres',value:'qualityRedosEdit'},
    {name:'Eliminar Rehaceres',value:'qualityRedosDelete'},
    {name:'Inspecciones', value:'qualityInspections'},
    {name:'Cronograma de Inspecciones',value:'qualityInspectionsCrono'},
    {name:'Lista general de Inspecciones',value:'qualityInspectionsGeneralList'},
    {name:'Lista personal de Inspecciones',value:'qualityInspectionsPersonalList'},
    {name:'Editar Inspecciones',value:'qualityInspectionsEdit'},
    {name:'Eliminar Inspecciones',value:'qualityInspectionsDelete'},
    {name:'Observaciones personales', value:'qualityInspectionsSingleObservations'},
    {name:'Eliminar Observaciones', value:'qualityInspectionsSingleObservationsDelete'},
    {name:'Lista general de Observaciones', value:'qualityInspectionsSingleObservationsGeneralList'},
    {name:'Lista personal de Observaciones', value:'qualityInspectionsSingleObservationsPersonalList'},
    {name:'Tareas', value:'qualityTasks'},
    {name:'Formulario de Tareas',value:'qualityTasksForm'},
    {name:'Lista general de Tareas',value:'qualityTasksGeneralList'},
    {name:'Lista personal de Tareas',value:'qualityTasksPersonalList'},
    {name:'Editar Tareas',value:'qualityTasksEdit'},
    {name:'Eliminar Tareas',value:'qualityTasksDelete'},
  ];

  maintenanceSelection = new SelectionModel<any>(true, []);
  maintenanceKeys: Array<any> = [
    {name:'Solicitudes', value:'maintenanceRequests'},
    {name:'Formulario de Solicitudes',value:'maintenanceRequestsForm'},
    {name:'Lista general de Solicitudes',value:'maintenanceRequestsGeneralList'},
    {name:'Lista personal de Solicitudes',value:'maintenanceRequestsPersonalList'},
    {name:'Editar Solicitudes',value:'maintenanceRequestsEdit'},
    {name:'Eliminar Solicitudes',value:'maintenanceRequestsDelete'},
  ];

  ssggSelection = new SelectionModel<any>(true, []);
  ssggKeys: Array<any> = [
    {name:'Solicitudes', value:'ssggRequests'},
    {name:'Formulario de Solicitudes',value:'ssggRequestsForm'},
    {name:'Lista general de Solicitudes',value:'ssggRequestsGeneralList'},
    {name:'Lista personal de Solicitudes',value:'ssggRequestsPersonalList'},
    {name:'Editar Solicitudes',value:'ssggRequestsEdit'},
    {name:'Eliminar Solicitudes',value:'ssggRequestsDelete'},
  ];

  configurationSelection = new SelectionModel<any>(true, []);
  configurationKeys: Array<any> = [
    {name:'Usuarios', value:'configurationUsers'},
    {name:'Valores del sistema',value:'configurationSystem'},
    {name:'Notificaciones',value:'configurationNotification'}
  ];


  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateNewPermitComponent>
  ) { }

  ngOnInit() {
    this.detailsFormGroup = this.fb.group({
      name: ['', Validators.required]
    })

    this.detailsFormGroup.get('name').valueChanges
      .pipe(
        debounceTime(1000),
        map(res => {
          let results = this.dbs.permits.filter(option => option['name'].includes(res));
          if(results.length > 0){
            return true
          }else{
            return false
          }
        })
      )
      .subscribe(res => {
        this.coincidence = res;
      })

    this.permitsConfigurationFormGroup = this.fb.group({
      generalDashboard: false,

      securitySection:false,
      securityFred:false,
      securityFredForm:false,
      securityFredGeneralList:false,
      securityFredPersonalList:false,
      securityFredEdit:false,
      securityFredDelete:false,
      securityInspections:false,
      securityInspectionsCrono:false,
      securityInspectionsGeneralList:false,
      securityInspectionsPersonalList:false,
      securityInspectionsEdit:false,
      securityInspectionsDelete:false,
      securityTasks:false,
      securityTasksGeneralList:false,
      securityTasksPersonalList:false,
      securityTasksEdit:false,
      securityTasksDelete:false,

      qualitySection:false,
      qualityRedos:false,
      qualityRedosGeneralList:false,
      qualityRedosPersonalList:false,
      qualityRedosEdit:false,
      qualityRedosDelete:false,
      qualityInspections:false,
      qualityInspectionsCrono:false,
      qualityInspectionsGeneralList:false,
      qualityInspectionsPersonalList:false,
      qualityInspectionsEdit:false,
      qualityInspectionsDelete:false,
      qualityInspectionsSingleObservations:false,
      qualityInspectionsSingleObservationsDelete:false,
      qualityInspectionsSingleObservationsGeneralList:false,
      qualityInspectionsSingleObservationsPersonalList:false,
      qualityTasks:false,
      qualityTasksForm:false,
      qualityTasksGeneralList:false,
      qualityTasksPersonalList:false,
      qualityTasksEdit:false,
      qualityTasksDelete:false,

      maintenanceSection:false,
      maintenanceRequests:false,
      maintenanceRequestsForm:false,
      maintenanceRequestsGeneralList:false,
      maintenanceRequestsPersonalList:false,
      maintenanceRequestsEdit:false,
      maintenanceRequestsDelete:false,

      ssggSection:false,
      ssggRequests:false,
      ssggRequestsForm:false,
      ssggRequestsGeneralList:false,
      ssggRequestsPersonalList:false,
      ssggRequestsEdit:false,
      ssggRequestsDelete:false,

      configurationSection:false,
      configurationUsers:false,
      configurationSystem:false,
      configurationNotification:false

    })

    this.securitySelection.onChange
    .pipe(
      debounceTime(1000)
    )
    .subscribe(res => {
      
      if(!this.securitySelection.hasValue()){
        this.permitsConfigurationFormGroup.get('securitySection').setValue(false);
      }else{
        this.permitsConfigurationFormGroup.get('securitySection').setValue(true);
      }
      // console.log(this.permitsConfigurationFormGroup.value);
      // console.log(res);
      // console.log(this.securitySelection.hasValue());
    })

    this.qualitySelection.onChange
    .pipe(
      debounceTime(1000)
    )
    .subscribe(res => {
      if(!this.qualitySelection.hasValue()){
        this.permitsConfigurationFormGroup.get('qualitySection').setValue(false);
      }else{
        this.permitsConfigurationFormGroup.get('qualitySection').setValue(true);
      }
      // console.log(this.permitsConfigurationFormGroup.value);
      // console.log(res);
      // console.log(this.qualitySelection.hasValue());
    })

    this.maintenanceSelection.onChange
    .pipe(
      debounceTime(1000)
    )
    .subscribe(res => {
      if(!this.maintenanceSelection.hasValue()){
        this.permitsConfigurationFormGroup.get('maintenanceSection').setValue(false);
      }else{
        this.permitsConfigurationFormGroup.get('maintenanceSection').setValue(true);
      }
      // console.log(this.permitsConfigurationFormGroup.value);
      // console.log(res);
      // console.log(this.maintenanceSelection.hasValue());
    })

    this.ssggSelection.onChange
    .pipe(
      debounceTime(1000)
    )
    .subscribe(res => {
      if(!this.ssggSelection.hasValue()){
        this.permitsConfigurationFormGroup.get('ssggSection').setValue(false);
      }else{
        this.permitsConfigurationFormGroup.get('ssggSection').setValue(true);
      }
      // console.log(this.permitsConfigurationFormGroup.value);
      // console.log(res);
      // console.log(this.ssggSelection.hasValue());
    })

    this.configurationSelection.onChange
    .pipe(
      debounceTime(1000)
    )
    .subscribe(res => {
      if(!this.configurationSelection.hasValue()){
        this.permitsConfigurationFormGroup.get('configurationSection').setValue(false);
      }else{
        this.permitsConfigurationFormGroup.get('configurationSection').setValue(true);
      }
      // console.log(this.permitsConfigurationFormGroup.value);
      // console.log(res);
      // console.log(this.ssggSelection.hasValue());
    })

  }

  // SECURITY METHODS

  isAllSecuritySelected() {

    const numSelected = this.securitySelection.selected.length;

    return numSelected === this.securityKeys.length;
  }

  masterSecurityToggle() {
    if(this.isAllSecuritySelected()){
      this.securitySelection.clear();
      this.securityKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(false));
      this.permitsConfigurationFormGroup.get('securitySection').setValue(false)
    }else{
      this.securityKeys.forEach(key => this.securitySelection.select(key['value']));
      this.securityKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(true));
    }
  }

  // QUALITY METHODS
  isAllQualitySelected() {
    const numSelected = this.qualitySelection.selected.length;

    return numSelected === this.qualityKeys.length;
  }

  masterQualityToggle() {
    if(this.isAllQualitySelected()){
      this.qualitySelection.clear();
      this.qualityKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(false));
      this.permitsConfigurationFormGroup.get('qualitySection').setValue(false)
    }else{
      this.qualityKeys.forEach(key => this.qualitySelection.select(key['value']));
      this.qualityKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(true));
    }
  }

  // MAINTENANCE METHODS
  isAllMaintenanceSelected() {
    const numSelected = this.maintenanceSelection.selected.length;

    return numSelected === this.maintenanceKeys.length;
  }

  masterMaintenanceToggle() {
    if(this.isAllMaintenanceSelected()){
      this.maintenanceSelection.clear();
      this.maintenanceKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(false));
      this.permitsConfigurationFormGroup.get('maintenanceSection').setValue(false)
    }else{
      this.maintenanceKeys.forEach(key => this.maintenanceSelection.select(key['value']));
      this.maintenanceKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(true));
    }
  }

  // SSGG METHODS
  isAllSsggSelected() {
    const numSelected = this.ssggSelection.selected.length;

    return numSelected === this.ssggKeys.length;
  }

  masterSsggToggle() {
    if(this.isAllSsggSelected()){
      this.ssggSelection.clear();
      this.ssggKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(false));
      this.permitsConfigurationFormGroup.get('ssggSection').setValue(false)
    }else{
      this.ssggKeys.forEach(key => this.ssggSelection.select(key['value']));
      this.ssggKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(true));
    }
  }

  // CONFIGURATION METHODS
  isAllConfigurationSelected() {
    const numSelected = this.configurationSelection.selected.length;

    return numSelected === this.configurationKeys.length;
  }

  masterConfigurationToggle() {
    if(this.isAllConfigurationSelected()){
      this.configurationSelection.clear();
      this.configurationKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(false));
      this.permitsConfigurationFormGroup.get('configurationSection').setValue(false)
    }else{
      this.configurationKeys.forEach(key => this.configurationSelection.select(key['value']));
      this.configurationKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(true));
    }
  }

  create(): void{
    let _permits = {};

    this.securitySelection.selected.forEach(element => {
      _permits[element] = true;
    });

    this.qualitySelection.selected.forEach(element => {
      _permits[element] = true;
    });

    this.maintenanceSelection.selected.forEach(element => {
      _permits[element] = true;
    });

    this.ssggSelection.selected.forEach(element => {
      _permits[element] = true;
    });

    this.configurationSelection.selected.forEach(element => {
      _permits[element] = true;
    });

    this.dbs.permitsCollection
      .add(_permits)
        .then(ref => {
          ref.update({
            id: ref.id,
            regDate: Date.now(),
            name: this.detailsFormGroup.value['name']
          });
          this.snackbar.open("Listo!","Cerrar");
          this.dialogRef.close(true);
        })
        .catch(err => {
          console.log(err);
          this.snackbar.open("Ups...Parece que hubo un error al guardar el permiso","Cerrar");
          this.dialogRef.close(true);
        })

  }

}
