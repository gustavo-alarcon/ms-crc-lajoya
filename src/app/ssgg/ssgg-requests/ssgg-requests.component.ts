import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar, MatChipInputEvent, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { startWith, map, tap } from 'rxjs/operators';
import { DatabaseService } from 'src/app/core/database.service';
import { SsggRequestsConfirmSaveComponent } from './ssgg-requests-confirm-save/ssgg-requests-confirm-save.component';
import { SsggRequestsConfirmDeleteComponent } from './ssgg-requests-confirm-delete/ssgg-requests-confirm-delete.component';
import { SsggRequestsDialogEditComponent } from './ssgg-requests-dialog-edit/ssgg-requests-dialog-edit.component';
import { SsggRequestsDialogTaskComponent } from './ssgg-requests-dialog-task/ssgg-requests-dialog-task.component';
import { AuthService } from 'src/app/core/auth.service';
import { SsggRequestsPicturesComponent } from '../ssgg-requests-pictures/ssgg-requests-pictures.component';

@Component({
  selector: 'app-ssgg-requests',
  templateUrl: './ssgg-requests.component.html',
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
export class SsggRequestsComponent implements OnInit {

  isOpenRequest: Array<any> = [];

  requestFormGroup: FormGroup;
  additionalsFormGroup: FormGroup;

  selectedFile = null;
  imageSrc: string | ArrayBuffer;

  monthsKey: Array<string> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  monthIndex: number;
  currentMonth: string;
  currentYear: number;
  year: number;
  percentage : number=0;
  
  monthFormControl = new FormControl({ value: new Date(), disabled: true });

  displayedColumnsRequests: string[] = ['index', 'date', 'initialPicture', 'mainArea', 'createdBy', 'type', 'priority', 'resumen', 'involvedAreas', 'coordinations', 'status', 'finalPicture', 'percentage', 'realTerminationDate', 'comments', 'edit'];
  dataSourceRequests = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filteredSsggTypes: Observable<any>;
  filteredSsggPriorities: Observable<any>;
  filteredAreas: Observable<any>;
  filteredInvolvedAreas: Observable<any>;
  filteredSsggRequests: Array<any>;

  subscriptions: Array<Subscription> = [];

  isSupervisor: boolean = false;

  @ViewChild('involvedAreasInput') involvedAreasInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoInvolvedAreas') matAutocomplete: MatAutocomplete;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  involvedAreasArray: Array<any> = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  optionsRequests = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    headers: ['Fecha de solicitud', 'Foto inicial', 'Área principal', 'Solicitante - Nombre', 'Solicitante - Área', 'Modificado por', 'Cerrado por', 'Confirmado por', 'Tipo', 'Prioridad', 'Resumen', 'Área inv.- Nombre', 'Área inv. - Supervisor', 'Coordinaciones', 'Estado', 'Foto - final', 'percentage', 'Fecha estimada', 'Fecha real', 'Comentarios'],
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

    this.titleRequests = 'Servicios_Generales_Solicitudes' + this.currentMonth + '_' + this.currentYear;

    this.optionsRequests['title'] = 'Servicios Generales - Solicitudes ' + this.currentMonth + ' ' + this.currentYear;

    this.createForms();

    this.filteredSsggTypes = this.requestFormGroup.get('type').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.ssggTypes.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.ssggTypes)
      );

    this.filteredSsggPriorities = this.requestFormGroup.get('priority').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.ssggPriorities.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.ssggPriorities)
      );

    this.filteredAreas = this.requestFormGroup.get('mainArea').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
      );

    this.filteredInvolvedAreas = this.additionalsFormGroup.get('involvedAreas').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
      );

    // ************** TAB - REQUEST LIST
    const dataSsggRequestsSubs = this.dbs.currentDataSsggRequests
    .pipe(
      tap(res => {
        this.downloadableRequests = [];
        res.forEach(element => {
          // Initializing _object
          let _object = {}

          // Adding date with format
          _object['fecha de creación'] = element['regDate'] ? this.datePipe.transform(new Date(element['regDate']), 'dd/MM/yyyy') : '---';

          // Adding initial picture
          _object['initial picture'] = element['initialPicture'] ? element['initialPicture'] : '---';

          // Adding main area
          _object['main area'] = element['mainArea'] ? element['mainArea']['name'] : '---';

          // Adding Creted by
          _object['created by name'] = element['createdBy']['displayName'];

          // Adding Creted by
          _object['created by area'] = element['createdBy']['area']['name'];

          // Adding Modified by
          _object['modified by'] = element['modifiedBy'] ? element['modifiedBy']['displayName'] : '---';

          // Adding Closed by
          _object['closed by'] = element['closedBy'] ? element['closedBy']['displayName'] : '---';

          // Adding Confirmed by
          _object['confirmed by'] = element['confirmedBy'] ? element['confirmedBy'] : '---';

          // Adding type
          _object['type'] = element['type'];

          // Adding priority
          _object['priority'] = element['priority'];

          // Adding resumen
          _object['resumen'] = element['resumen'];

           // Adding Area name
           _object['area name'] = element['involvedAreas'][0]['name'];

           // Adding Area supervisor
           _object['area supervisor'] = element['involvedAreas'][0]['supervisor']['displayName'];

           // Adding coordinations
          _object['coordinations'] = element['coordinations'];

          // Adding status
          _object['status'] = element['status'];

          // Adding final picture
          _object['final picture'] = element['finalPicture'] ? element['finalPicture'] : '---';

          // Adding percentage
          _object['percentage'] = element['percentage'];

          // Adding inspection date
          _object['fecha estimada'] = element['estimatedTerminationDate'] ? this.datePipe.transform(new Date(element['estimatedTerminationDate']), 'dd/MM/yyyy') : '---';

          // Adding real date
          _object['fecha real'] = element['realTerminationDate'] ? this.datePipe.transform(new Date(element['realTerminationDate']), 'dd/MM/yyyy') : '---';

          // Adding comments
          _object['comments'] = element['comments'];

          this.downloadableRequests.push(_object);

        });
      }),
      map(res => {
        res.forEach(element => {
          let counter = 0;
          if (!!element['finalPicture1']) { counter++; }
          if (!!element['finalPicture2']) { counter++; }
          if (!!element['finalPicture3']) { counter++; }
          if (!!element['finalPicture4']) { counter++; }
          element['pictureCounter'] = counter;
        });
        return res;
      })
    )
    .subscribe(res => {
      this.filteredSsggRequests = res;
      this.dataSourceRequests.data = res;
      this.filteredSsggRequests.forEach(element => {
        this.isOpenRequest.push(false);
      });
    });

    this.subscriptions.push(dataSsggRequestsSubs);

    const ssggSupervisorSubs = this.dbs.currentDataSsggSupervisors
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

    this.subscriptions.push(ssggSupervisorSubs);

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

    this.dbs.getSsggRequests(fromDate.valueOf(), toDate.valueOf());

    datepicker.close();
  }

  createForms(): void {
    this.requestFormGroup = this.fb.group({
      mainArea: ['', [Validators.required]],
      type: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      resumen: ['', [Validators.required]],
    });

    this.additionalsFormGroup = this.fb.group({
      estimatedTerminationDate: '',
      involvedAreas: '',
      coordinations: ''
    });
  }

  toggleCardRequest(index) {
    this.isOpenRequest[index] = !this.isOpenRequest[index];
  }

  showSelectedArea(area): string | undefined {
    return area ? area['name'] : undefined;
  }

  selectedArea(event): void {
    this.involvedAreasArray.push(event.option.value);
  }

  // MAT CHIPS WITH AUTOCOMPLETE
  add(event: MatChipInputEvent): void {

    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if (typeof value === 'object') {
        this.involvedAreasArray.push(value);
      }

      if (input) {
        input.value = '';
      }

      this.additionalsFormGroup.get('involvedAreas').setValue('');
    }
  }

  remove(area: any): void {
    const index = this.involvedAreasArray.indexOf(area);

    if (index >= 0) {
      this.involvedAreasArray.splice(index, 1);
    }
  }

  selectedInvolvedArea(event: MatAutocompleteSelectedEvent): void {
    this.involvedAreasArray.push(event.option.value);
    this.involvedAreasInput.nativeElement.value = '';
    this.additionalsFormGroup.get('involvedAreas').setValue(' ');
  }
  // ********************************************************

  onFileSelected(event): void {
    this.selectedFile = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);
    }
  }

  save(): void {

    if (!this.selectedFile) {
      this.snackbar.open("Adjunte una imagen para poder guardar el documento", "Cerrar", {
        duration: 6000
      });
      return;
    }

    if (this.requestFormGroup.valid) {

      let dialogRef = this.dialog.open(SsggRequestsConfirmSaveComponent, {
        data: {
          form: Object.assign(this.requestFormGroup.value, this.additionalsFormGroup.value),
          image: this.selectedFile,
          involvedAreas: this.involvedAreasArray
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.createForms();
          this.involvedAreasArray = [];
        }
      });

    } else {
      this.snackbar.open("Complete todo los campos requeridos para poder guardar el documento", "Cerrar", {
        duration: 6000
      });
    }

  }

  delete(id_request, involvedAreas): void {
    this.dialog.open(SsggRequestsConfirmDeleteComponent, {
      data: {
        id_request: id_request,
        involvedAreas: involvedAreas
      }
    });
  }

  edit(request): void {
    this.dialog.open(SsggRequestsDialogEditComponent, {
      data: request,
      autoFocus: false
    })
  }

  task(request): void {
    this.dialog.open(SsggRequestsDialogTaskComponent, {
      data: request,
      autoFocus: false
    })
  }

  openPictures(data): void {
    this.dialog.open(SsggRequestsPicturesComponent, {
      data: data
    });
  }

}
