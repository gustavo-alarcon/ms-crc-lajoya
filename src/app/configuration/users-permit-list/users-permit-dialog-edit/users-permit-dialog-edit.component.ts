import { Component, OnInit, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-users-permit-dialog-edit',
  templateUrl: './users-permit-dialog-edit.component.html',
  styles: []
})
export class UsersPermitDialogEditComponent implements OnInit {

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
    public dialogRef: MatDialogRef<UsersPermitDialogEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.detailsFormGroup = this.fb.group({
      name: [this.data['name'], Validators.required]
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

    console.log(this.data);

    this.permitsConfigurationFormGroup = this.fb.group({
      generalDashboard: this.data['generalDashboard'],

      securitySection:this.data['securitySection']?this.data['securitySection']:false,
      securityFred:this.data['securityFred']?this.data['securityFred']:false,
      securityFredForm:this.data['securityFredForm']?this.data['securityFredForm']:false,
      securityFredGeneralList:this.data['securityFredGeneralList']?this.data['securityFredGeneralList']:false,
      securityFredPersonalList:this.data['securityFredPersonalList']?this.data['securityFredPersonalList']:false,
      securityFredEdit:this.data['securityFredEdit']?this.data['securityFredEdit']:false,
      securityFredDelete:this.data['securityFredDelete']?this.data['securityFredDelete']:false,
      securityInspections:this.data['securityInspections']?this.data['securityInspections']:false,
      securityInspectionsCrono:this.data['securityInspectionsCrono']?this.data['securityInspectionsCrono']:false,
      securityInspectionsGeneralList:this.data['securityInspectionsGeneralList']?this.data['securityInspectionsGeneralList']:false,
      securityInspectionsPersonalList:this.data['securityInspectionsPersonalList']?this.data['securityInspectionsPersonalList']:false,
      securityInspectionsEdit:this.data['securityInspectionsEdit']?this.data['securityInspectionsEdit']:false,
      securityInspectionsDelete:this.data['securityInspectionsDelete']?this.data['securityInspectionsDelete']:false,
      securityTasks:this.data['securityTasks']?this.data['securityTasks']:false,
      securityTasksGeneralList:this.data['securityTasksGeneralList']?this.data['securityTasksGeneralList']:false,
      securityTasksPersonalList:this.data['securityTasksPersonalList']?this.data['securityTasksPersonalList']:false,
      securityTasksEdit:this.data['securityTasksEdit']?this.data['securityTasksEdit']:false,
      securityTasksDelete:this.data['securityTasksDelete']?this.data['securityTasksDelete']:false,

      qualitySection:this.data['qualitySection']?this.data['qualitySection']:false,
      qualityRedos:this.data['qualityRedos']?this.data['qualityRedos']:false,
      qualityRedosGeneralList:this.data['qualityRedosGeneralList']?this.data['qualityRedosGeneralList']:false,
      qualityRedosPersonalList:this.data['qualityRedosPersonalList']?this.data['qualityRedosPersonalList']:false,
      qualityRedosEdit:this.data['qualityRedosEdit']?this.data['qualityRedosEdit']:false,
      qualityRedosDelete:this.data['qualityRedosDelete']?this.data['qualityRedosDelete']:false,
      qualityInspections:this.data['qualityInspections']?this.data['qualityInspections']:false,
      qualityInspectionsCrono:this.data['qualityInspectionsCrono']?this.data['qualityInspectionsCrono']:false,
      qualityInspectionsGeneralList:this.data['qualityInspectionsGeneralList']?this.data['qualityInspectionsGeneralList']:false,
      qualityInspectionsPersonalList:this.data['qualityInspectionsPersonalList']?this.data['qualityInspectionsPersonalList']:false,
      qualityInspectionsEdit:this.data['qualityInspectionsEdit']?this.data['qualityInspectionsEdit']:false,
      qualityInspectionsDelete:this.data['qualityInspectionsDelete']?this.data['qualityInspectionsDelete']:false,
      qualityInspectionsSingleObservations:this.data['qualityInspectionsSingleObservations']?this.data['qualityInspectionsSingleObservations']:false,
      qualityInspectionsSingleObservationsDelete:this.data['qualityInspectionsSingleObservationsDelete']?this.data['qualityInspectionsSingleObservationsDelete']:false,
      qualityInspectionsSingleObservationsGeneralList:this.data['qualityInspectionsSingleObservationsGeneralList']?this.data['qualityInspectionsSingleObservationsGeneralList']:false,
      qualityInspectionsSingleObservationsPersonalList:this.data['qualityInspectionsSingleObservationsPersonalList']?this.data['qualityInspectionsSingleObservationsPersonalList']:false,
      qualityTasks:this.data['qualityTasks']?this.data['qualityTasks']:false,
      qualityTasksForm:this.data['qualityTasksForm']?this.data['qualityTasksForm']:false,
      qualityTasksGeneralList:this.data['qualityTasksGeneralList']?this.data['qualityTasksGeneralList']:false,
      qualityTasksPersonalList:this.data['qualityTasksPersonalList']?this.data['qualityTasksPersonalList']:false,
      qualityTasksEdit:this.data['qualityTasksEdit']?this.data['qualityTasksEdit']:false,
      qualityTasksDelete:this.data['qualityTasksDelete']?this.data['qualityTasksDelete']:false,

      maintenanceSection:this.data['maintenanceSection']?this.data['maintenanceSection']:false,
      maintenanceRequests:this.data['maintenanceRequests']?this.data['maintenanceRequests']:false,
      maintenanceRequestsForm:this.data['maintenanceRequestsForm']?this.data['maintenanceRequestsForm']:false,
      maintenanceRequestsGeneralList:this.data['maintenanceRequestsGeneralList']?this.data['maintenanceRequestsGeneralList']:false,
      maintenanceRequestsPersonalList:this.data['maintenanceRequestsPersonalList']?this.data['maintenanceRequestsPersonalList']:false,
      maintenanceRequestsEdit:this.data['maintenanceRequestsEdit']?this.data['maintenanceRequestsEdit']:false,
      maintenanceRequestsDelete:this.data['maintenanceRequestsDelete']?this.data['maintenanceRequestsDelete']:false,

      ssggSection:this.data['ssggSection']?this.data['ssggSection']:false,
      ssggRequests:this.data['ssggRequests']?this.data['ssggRequests']:false,
      ssggRequestsForm:this.data['ssggRequestsForm']?this.data['ssggRequestsForm']:false,
      ssggRequestsGeneralList:this.data['ssggRequestsGeneralList']?this.data['ssggRequestsGeneralList']:false,
      ssggRequestsPersonalList:this.data['ssggRequestsPersonalList']?this.data['ssggRequestsPersonalList']:false,
      ssggRequestsEdit:this.data['ssggRequestsEdit']?this.data['ssggRequestsEdit']:false,
      ssggRequestsDelete:this.data['ssggRequestsDelete']?this.data['ssggRequestsDelete']:false,

      configurationSection:this.data['configurationSection']?this.data['configurationSection']:false,
      configurationUsers:this.data['configurationUsers']?this.data['configurationUsers']:false,
      configurationSystem:this.data['configurationSystem']?this.data['configurationSystem']:false,
      configurationNotification:this.data['configurationNotification']?this.data['configurationNotification']:false

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

  edit(): void{
    let _permits = this.permitsConfigurationFormGroup.value;

    // this.securitySelection.selected.forEach(element => {
    //   _permits[element] = true;
    // });

    // this.qualitySelection.selected.forEach(element => {
    //   _permits[element] = true;
    // });

    // this.maintenanceSelection.selected.forEach(element => {
    //   _permits[element] = true;
    // });

    // this.ssggSelection.selected.forEach(element => {
    //   _permits[element] = true;
    // });

    // this.configurationSelection.selected.forEach(element => {
    //   _permits[element] = true;
    // });



    _permits['name'] = this.detailsFormGroup.value['name'];
    _permits['id'] = this.data['id'];
    _permits['regDate'] = Date.now();
    _permits['generalDashboard'] = true;
    _permits['securitySection'] = this.securitySelection.selected.length > 0 ? true: false;
    _permits['qualitySection'] = this.qualitySelection.selected.length > 0 ? true: false;
    _permits['maintenanceSection'] = this.maintenanceSelection.selected.length > 0 ? true: false;
    _permits['ssggSection'] = this.ssggSelection.selected.length > 0 ? true: false;
    _permits['configurationSection'] = this.configurationSelection.selected.length > 0 ? true: false;    
    
    this.dbs.permitsCollection
      .doc(this.data['id'])
      .set(_permits)
        .then(() => {
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