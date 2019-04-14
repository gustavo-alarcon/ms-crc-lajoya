import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MaintenanceRequestsConfirmEditComponent } from '../maintenance-requests-confirm-edit/maintenance-requests-confirm-edit.component';

@Component({
  selector: 'app-maintenance-requests-dialog-edit',
  templateUrl: './maintenance-requests-dialog-edit.component.html',
  styles: []
})
export class MaintenanceRequestsDialogEditComponent implements OnInit {

  requestFormGroup: FormGroup;
  taskFormGroup: FormGroup;

  selectedFile_initial = null;
  imageSrc_initial: string | ArrayBuffer;

  selectedFile_final = null;
  imageSrc_final: string | ArrayBuffer;

  filteredMaintenanceEquipments: Observable<any>;
  filteredMaintenancePriorities: Observable<any>;
  filteredAreas: Observable<any>;
  filteredMaintenanceRequests: Array<any>;

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
    private dialogRef: MatDialogRef<MaintenanceRequestsDialogEditComponent>
  ) { }

  ngOnInit() {

    this.createForms();

    this.filteredMaintenanceEquipments =  this.requestFormGroup.get('equipment').valueChanges
                                            .pipe(
                                              startWith<any>(''),
                                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                              map(name => name ? this.dbs.maintenanceEquipments.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.maintenanceEquipments)
                                            );

    this.filteredMaintenancePriorities =  this.requestFormGroup.get('priority').valueChanges
                                            .pipe(
                                              startWith<any>(''),
                                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                              map(name => name ? this.dbs.maintenancePriorities.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.maintenancePriorities)
                                            );

    this.filteredAreas = this.requestFormGroup.get('area').valueChanges
                          .pipe(
                            startWith<any>(''),
                            map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                            map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
                          );

    // ************** TAB - REQUEST LIST
    let dataMaintenanceRequestsSubs =  this.dbs.currentDataMaintenanceRequests.subscribe(res => {
      this.filteredMaintenanceRequests = res;
    });

    this.subscriptions.push(dataMaintenanceRequestsSubs);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  createForms(): void{
    this.requestFormGroup = this.fb.group({
      equipment: [this.data['equipment'], [Validators.required]],
      area: [this.data['area'], [Validators.required]],
      observation: [this.data['observation'], [Validators.required]],
      priority: [this.data['priority'], [Validators.required]]
    });

    this.taskFormGroup = this.fb.group({
      status: this.data['status'],
      maintenanceDetails: this.data['maintenanceDetails'],
    });

    this.imageSrc_initial = this.data['initialPicture'];
    this.imageSrc_final = this.data['finalPicture'];
  }

  showSelectedArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  selectedArea(event): void{
    
  }

  showSelectedEquipment(equipment): string | undefined {
    return equipment? equipment['name'] : undefined;
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

    if(!this.imageSrc_final && (this.taskFormGroup.value['status'] === "Finalizado")){
      this.snackbar.open("Adjunte imagen FINAL para poder guardar el documento","Cerrar", {
        duration: 6000
      });
      return;
    }

    if(this.requestFormGroup.valid){

      let dialogRef = this.dialog.open(MaintenanceRequestsConfirmEditComponent,{
        data: {
          form: Object.assign(this.requestFormGroup.value,this.taskFormGroup.value),
          requestId: this.data['id'],
          initialImage: this.selectedFile_initial,
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
