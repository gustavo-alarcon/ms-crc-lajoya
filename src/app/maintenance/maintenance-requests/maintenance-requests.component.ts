import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { startWith, map, tap } from 'rxjs/operators';
import { MaintenanceRequestsConfirmSaveComponent } from './maintenance-requests-confirm-save/maintenance-requests-confirm-save.component';
import { MaintenanceRequestsConfirmDeleteComponent } from './maintenance-requests-confirm-delete/maintenance-requests-confirm-delete.component';
import { MaintenanceRequestsDialogEditComponent } from './maintenance-requests-dialog-edit/maintenance-requests-dialog-edit.component';
import { MaintenanceRequestsDialogTaskComponent } from './maintenance-requests-dialog-task/maintenance-requests-dialog-task.component';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-maintenance-requests',
  templateUrl: './maintenance-requests.component.html',
  animations: [
    trigger('openCloseCard', [
      state('open', style({
        height: '120px',
        opacity: 0.8,
        borderRadius: '10px 10px 0px 0px',
        marginBottom: '0em'
      })),
      state('closed', style({
        height: '200px',
        opacity: 1,
        borderRadius: '10px 10px 10px 10px',
        marginBottom: '1em'
      })),
      transition('open => closed', [
        animate('1s ease-in')
      ]),
      transition('closed => open', [
        animate('0.5s ease-out')
      ])
    ]),
    trigger('openCloseContent', [
      state('openContent', style({
        maxHeight: '2000px',
        opacity: 1,
        marginBottom: '1em'
      })),
      state('closedContent', style({
        height: '0px',
        opacity: 0,
        display: 'none',
        marginBottom: '0em'
      })),
      transition('openContent => closedContent', [
        animate('1s ease-in')
      ]),
      transition('closedContent => openContent', [
        animate('0.5s')
      ])
    ]),
    trigger('openCloseDescription', [
      state('openDescription', style({
        borderRadius: '0px 10px 0px 0px'
      })),
      state('closedDescription', style({
        borderRadius: '0px 10px 0px 10px'
      })),
      transition('openDescription => closedDescription', [
        animate('1s ease-in')
      ]),
      transition('closedDescription => openDescription', [
        animate('0.5s ease-out')
      ])
    ])
  ]
})
export class MaintenanceRequestsComponent implements OnInit, OnDestroy {

  isOpenRequest: Array<any> = [];

  requestFormGroup: FormGroup;

  selectedFile = null;
  imageSrc: string | ArrayBuffer;

  monthsKey: Array<string> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  monthIndex: number;
  currentMonth: string;
  currentYear: number;
  year: number;

  monthFormControl = new FormControl({ value: new Date(), disabled: true });

  displayedColumnsRequests: string[] = ['index', 'date', 'initialPicture', 'createdBy', 'area', 'equipment', 'priority', 'observation', 'status', 'finalPicture', 'realTerminationDate', 'maintenanceDetails', 'edit'];
  dataSourceRequests = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filteredMaintenanceEquipments: Observable<any>;
  filteredMaintenancePriorities: Observable<any>;
  filteredAreas: Observable<any>;

  filteredMaintenanceRequests: Array<any> = [];
  filteredEquipments: Array<any> = [];

  subscriptions: Array<Subscription> = [];

  isSupervisor: boolean = false;
  isBroadcast: boolean = true;

  someAreaselected: boolean = false;
  someEquipmentSelected: boolean = false;

  optionsRequests = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    headers: ['Fecha de solicitud', 'Solicitante', 'Modificado por', 'Cerrado por', 'Confirmado por', 'Área - Nombre', 'Área - Supervisor', 'Equipo - Nombre', 'Equipo - Área', 'Prioridad', 'Observación', 'Estado', 'Fecha estimada', 'Fecha real', 'Foto - inicial', 'Foto - final', 'Detalles - mantenimiento'],
    showTitle: true,
    title: '',
    useBom: false,
    removeNewLines: true
    //keys: ['approved','age','name' ]
  };

  titleRequests: string = '';

  downloadableRequests = [];
  downloadableInspections: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    public auth: AuthService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {

    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();

    this.titleRequests = 'Mantenimiento_Solicitudes' + this.currentMonth + '_' + this.currentYear;

    this.optionsRequests['title'] = 'Mantenimiento - Solicitudes ' + this.currentMonth + ' ' + this.currentYear;

    this.createForms();

    this.filteredMaintenanceEquipments = this.requestFormGroup.get('equipment').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.filteredEquipments.filter(option => option['name'].toLowerCase().includes(name)) : this.filteredEquipments)
      );

    this.filteredAreas = this.requestFormGroup.get('area').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
      );

    // ************** TAB - REQUEST LIST
    let dataMaintenanceRequestsSubs =
      this.dbs.currentDataMaintenanceRequests
      .pipe(
        tap(res => {
          this.downloadableRequests = [];
          res.forEach(element => {
            // Initializing _object
            let _object = {}

            // Adding date with format
            _object['fecha de creación'] = element['regDate'] ? this.datePipe.transform(new Date(element['regDate']), 'dd/MM/yyyy') : '---';

            // Adding Creted by
            _object['solicitante'] = element['createdBy']['displayName'];

            // Adding Modified by
            _object['modificado por'] = element['modifiedBy'] ? element['modifiedBy']['displayName'] : '---';

            // Adding Closed by
            _object['cerrado por'] = element['closedBy'] ? element['closedBy']['displayName'] : '---';

            // Adding Confirmed by
            _object['confirmado por'] = element['confirmedBy'] ? element['confirmedBy'] : '---';

            // Adding Area name
            _object['area name'] = element['area']['name'];

            // Adding Area supervisor
            _object['area supervisor'] = element['area']['supervisor']['displayName'];

            // Adding equipment name
            _object['equipment name'] = element['equipment']['name'];

            // Adding equipment name
            _object['equipment area'] = element['equipment']['area']['name'];

            // Adding priority
            _object['priority'] = element['priority'];

            // Adding observation
            _object['observation'] = element['observation'];

            // Adding inspection status
            _object['estado'] = element['status'];

            // Adding inspection date
            _object['fecha estimada'] = element['estimatedTerminationDate'] ? this.datePipe.transform(new Date(element['estimatedTerminationDate']), 'dd/MM/yyyy') : '---';

            // Adding real date
            _object['fecha real'] = element['realTerminationDate'] ? this.datePipe.transform(new Date(element['realTerminationDate']), 'dd/MM/yyyy') : '---';

            // Adding initial picture
            _object['initial picture'] = element['initialPicture'] ? element['initialPicture'] : '---';

            // Adding final picture
            _object['final picture'] = element['finalPicture'] ? element['finalPicture'] : '---';

            // Adding maintenance details
            _object['maintenanceDetails'] = element['maintenanceDetails'];

            this.downloadableRequests.push(_object);

          });
        })
      )
      .subscribe(res => {
        this.filteredMaintenanceRequests = res;
        this.dataSourceRequests.data = res;
        this.filteredMaintenanceRequests.forEach(element => {
          this.isOpenRequest.push(false);
        })
      });

    this.subscriptions.push(dataMaintenanceRequestsSubs);

    // checking if user is supervisor
    let isSupervisorSubs = this.dbs.currentDataMaintenanceSupervisors
      .subscribe(res => {
        if (res) {
          this.isSupervisor = false;
          res.forEach(element => {
            if (element['uid'] === this.auth.userCRC.uid) {
              this.isSupervisor = true;
            }
          })
        }
      })

    this.subscriptions.push(isSupervisorSubs);

    // adding sort and paginator
    this.dataSourceRequests.paginator = this.paginator;
    this.dataSourceRequests.sort = this.sort;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setMonthOfView(event, datepicker): void {
    this.monthFormControl = new FormControl({ value: event, disabled: true });
    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();
    let fromDate: Date = new Date(this.currentYear, this.monthIndex, 1);

    let toMonth = (fromDate.getMonth() + 1) % 12;
    let toYear = this.currentYear;

    if (fromDate.getMonth() + 1 >= 13) {
      toYear++;
    }

    let toDate: Date = new Date(toYear, toMonth, 1);

    this.dbs.getMaintenanceRequests(fromDate.valueOf(), toDate.valueOf());

    datepicker.close();
  }

  createForms(): void {
    this.requestFormGroup = this.fb.group({
      area: ['', [Validators.required]],
      equipment: ['', [Validators.required]],
      observation: ['', [Validators.required]]
    });
  }

  toggleCardRequest(index) {
    this.isOpenRequest[index] = !this.isOpenRequest[index];
  }

  showSelectedArea(area): string | undefined {
    return area ? area['name'] : undefined;
  }

  selectedArea(event): void {
    this.someAreaselected = true;
    let ref = event.option.value['name'].toLowerCase();
    this.filteredEquipments = this.dbs.maintenanceEquipmentsConfig.filter(option => option['area']['name'].toLowerCase() === ref);
  }

  showSelectedEquipment(equipment): string | undefined {
    return equipment ? equipment['name'] : undefined;
  }

  selectedEquipment(event): void {
    this.someEquipmentSelected = true;
  }

  save(): void {

    if (!this.someAreaselected) {
      this.snackbar.open("Debe seleccionar un área de la lista y luego escoger un equipo", "Cerrar", {
        duration: 6000
      });
      return;
    }

    if (!this.someEquipmentSelected) {
      this.snackbar.open("Debe seleccioanr un equipo de la lista de auto-completado", "Cerrar", {
        duration: 6000
      });
      return;
    }


    if (!this.selectedFile) {
      this.snackbar.open("Adjunte una imagen para poder guardar el documento", "Cerrar", {
        duration: 6000
      });
      return;
    }

    if (this.requestFormGroup.valid) {

      let dialogRef = this.dialog.open(MaintenanceRequestsConfirmSaveComponent, {
        data: {
          form: this.requestFormGroup.value,
          image: this.selectedFile
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.createForms();
        }
      });

    } else {
      this.snackbar.open("Complete todo los campos requeridos para poder guardar el documento", "Cerrar", {
        duration: 6000
      });
    }

  }

  onFileSelected(event): void {
    this.selectedFile = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);
    }
  }

  delete(id_request, id_supervisor): void {

    this.dialog.open(MaintenanceRequestsConfirmDeleteComponent, {
      data: {
        id_request: id_request,
        id_supervisor: id_supervisor
      }
    });
  }

  edit(request): void {
    this.dialog.open(MaintenanceRequestsDialogEditComponent, {
      data: request,
      autoFocus: false
    })
  }

  task(request): void {
    this.dialog.open(MaintenanceRequestsDialogTaskComponent, {
      data: request,
      autoFocus: false
    })
  }

}
