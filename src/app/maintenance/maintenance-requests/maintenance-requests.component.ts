import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { startWith, map } from 'rxjs/operators';
import { MaintenanceRequestsConfirmSaveComponent } from './maintenance-requests-confirm-save/maintenance-requests-confirm-save.component';
import { MaintenanceRequestsConfirmDeleteComponent } from './maintenance-requests-confirm-delete/maintenance-requests-confirm-delete.component';
import { MaintenanceRequestsDialogEditComponent } from './maintenance-requests-dialog-edit/maintenance-requests-dialog-edit.component';
import { MaintenanceRequestsDialogTaskComponent } from './maintenance-requests-dialog-task/maintenance-requests-dialog-task.component';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-maintenance-requests',
  templateUrl: './maintenance-requests.component.html',
  animations: [
    trigger('openCloseCard',[
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
    trigger('openCloseContent',[
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
    trigger('openCloseDescription',[
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

  monthsKey: Array<string> = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  monthIndex: number;
  currentMonth: string;
  currentYear: number;
  year: number;

  monthFormControl = new FormControl({value:new Date(), disabled: true});

  displayedColumnsRequests: string[] = ['index', 'date', 'initialPicture', 'createdBy', 'area', 'equipment', 'priority', 'observation', 'status', 'finalPicture', 'realTerminationDate', 'maintenanceDetails', 'edit'];
  dataSourceRequests = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filteredMaintenanceEquipments: Observable<any>;
  filteredMaintenancePriorities: Observable<any>;
  filteredAreas: Observable<any>;
  filteredMaintenanceRequests: Array<any>;

  subscriptions: Array<Subscription> = [];

  isSupervisor: boolean = false;
  isBroadcast: boolean = true;


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    public auth: AuthService
  ) { }

  ngOnInit() {

    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();

    this.createForms();

    this.filteredMaintenanceEquipments =  this.requestFormGroup.get('equipment').valueChanges
                                            .pipe(
                                              startWith<any>(''),
                                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                              map(name => name ? this.dbs.maintenanceEquipments.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.maintenanceEquipments)
                                            );

    // ************** TAB - REQUEST LIST
    let dataMaintenanceRequestsSubs = this.dbs.currentDataMaintenanceRequests.subscribe(res => {
                                        this.filteredMaintenanceRequests = res;
                                        this.dataSourceRequests.data = res;
                                        this.filteredMaintenanceRequests.forEach(element => {
                                          this.isOpenRequest.push(false);
                                        })
                                      });

    this.subscriptions.push(dataMaintenanceRequestsSubs);

    // checking if user is supervisor
    let isSupervisorSubs = this.dbs.currentDataMaintenanceSupervisors
      .subscribe( res => {
        if(res){
          this.isSupervisor = false;
          res.forEach(element => {
            if(element['uid'] === this.auth.userCRC.uid){
              this.isSupervisor = true;
            }
          })
        }
      })

    this.subscriptions.push(isSupervisorSubs);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setMonthOfView(event, datepicker): void {
    this.monthFormControl = new FormControl({value:event, disabled:true});
    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();
    let fromDate: Date = new Date(this.currentYear, this.monthIndex, 1);

    let toMonth = (fromDate.getMonth()+ 1) % 12;
    let toYear = this.currentYear;

    if(fromDate.getMonth() + 1 >= 13){
      toYear ++;
    }

    let toDate: Date = new Date(toYear, toMonth, 1);

    this.dbs.getMaintenanceRequests(fromDate.valueOf(), toDate.valueOf());
    
    datepicker.close();
  }

  createForms(): void{
    this.requestFormGroup = this.fb.group({
      equipment: ['', [Validators.required]],
      observation: ['', [Validators.required]]
    });
  }

  toggleCardRequest(index) {
    this.isOpenRequest[index] = !this.isOpenRequest[index];
  }

  showSelectedArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  selectedArea(event): void{
    
  }

  showSelectedEquipment(equipment): string | undefined {
    return equipment? equipment['name'] : undefined;
  }

  save(): void{

    if(!this.selectedFile){
      this.snackbar.open("Adjunte una imagen para poder guardar el documento","Cerrar", {
        duration: 6000
      });
      return;
    }

    if(this.requestFormGroup.valid){
      
      let dialogRef = this.dialog.open(MaintenanceRequestsConfirmSaveComponent,{
        data: {
          form: this.requestFormGroup.value,
          image: this.selectedFile
        }
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

  onFileSelected(event): void{
    this.selectedFile = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);
    }
  }

  delete(id_request, id_supervisor): void{

    this.dialog.open(MaintenanceRequestsConfirmDeleteComponent, {
      data: {
        id_request: id_request,
        id_supervisor: id_supervisor
      }
    });
  }

  edit(request): void{
    this.dialog.open(MaintenanceRequestsDialogEditComponent,{
      data: request,
      autoFocus: false
    })
  }

  task(request): void{
    this.dialog.open(MaintenanceRequestsDialogTaskComponent,{
      data: request,
      autoFocus: false
    })
  }

}
