import { Component, OnInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FredConfirmSaveComponent } from './fred-confirm-save/fred-confirm-save.component';
import { DatabaseService } from 'src/app/core/database.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { FredConfirmDeleteComponent } from './fred-confirm-delete/fred-confirm-delete.component';
import { Subscription, Observable } from 'rxjs';
import { startWith, map, tap } from 'rxjs/operators';
import { FredEditDialogComponent } from './fred-edit-dialog/fred-edit-dialog.component';
import { AuthService } from 'src/app/core/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-security-fred',
  templateUrl: './security-fred.component.html',
  styles: [],
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
export class SecurityFredComponent implements OnInit, OnDestroy {

  isOpenSubstandardAct: Array<any> = [];
  isOpenSubstandardCondition: Array<any> = [];
  isOpenRemarkableAct: Array<any> = [];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  selectedFile = null;
  imageSrc: string | ArrayBuffer;

  monthsKey: Array<string> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  monthIndex: number;
  currentMonth: string;
  currentYear: number;
  year: number;

  monthFormControl = new FormControl({ value: new Date(), disabled: true });

  fredTypes: Array<string> = [
    'Acto sub-estandar',
    'Condición sub-estandar',
    'Acto destacable'
  ]

  displayedColumnsSubstandardAct: string[] = ['index', 'date', 'observations', 'initialPicture', 'observer', 'observedArea', 'staffObserved', 'substandardAct', 'upgradeOpportunity', 'status', 'percent', 'terminationDates', 'finalPicture', 'edit'];
  dataSourceSubstandardAct = new MatTableDataSource();

  displayedColumnsSubstandardCondition: string[] = ['index', 'date', 'initialPicture', 'observer', 'observedArea', 'staffObserved', 'substandardCondition', 'upgradeOpportunity', 'status', 'percent', 'terminationDates', 'finalPicture', 'edit'];
  dataSourceSubstandardCondition = new MatTableDataSource();

  displayedColumnsRemarkableAct: string[] = ['index', 'date', 'initialPicture', 'observer', 'observedArea', 'staffObserved', 'remarkableAct', 'upgradeOpportunity', 'status', 'percent', 'terminationDates', 'finalPicture', 'edit'];
  dataSourceRemarkableAct = new MatTableDataSource();

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  filteredSubstandardActFreds: Array<any> = [];
  filteredSubstandardConditionFreds: Array<any> = [];
  filteredRemarkableActFreds: Array<any> = [];
  filteredFreds: Array<any> = [];

  subscriptions: Array<Subscription> = [];

  filteredTypes: Observable<any>;
  filteredAreas: Observable<any>;
  filteredStaff: Observable<any>;

  filteredObsList1: Observable<any>;
  filteredObsList2: Observable<any>;
  filteredObsList3: Observable<any>;
  filteredObsList4: Observable<any>;
  filteredObsList5: Observable<any>;

  /**
   * TEST
   */

  optionsList1 = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    headers: ['Fecha', 'Obs - Orden y Limpieza', 'Obs - Equipos de Portección Personal', 'Obs - Control de Riesgos Operacionales', 'Obs - Herramientas y Equipos', 'Obs - Riesgos Críticos', 'Foto inicial', 'Observador - Usuario', 'Observador - Área', 'Área observada - Nombre', 'Área observada - Supervisor', 'Personal observado - Usuario', 'Personal observado - Área', 'Acto sub-estandar', 'Mejora', 'Estado', 'Porcentaje', 'Fecha Propuesta', 'Fecha cierre', 'Foto final'],
    showTitle: true,
    title: 'FRED - Actos sub-estandar',
    useBom: false,
    removeNewLines: true
    //keys: ['approved','age','name' ]
  };

  optionsList2 = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: ['Fecha', 'Foto inicial', 'Observador - Usuario', 'Observador - Área', 'Área observada - Nombre', 'Área observada - Supervisor', 'Personal observado - Usuario', 'Personal observado - Área', 'Condición sub-estandar', 'Mejora', 'Estado', 'Porcentaje', 'Fecha Propuesta', 'Fecha cierre', 'Foto final'],
    showTitle: true,
    title: 'FRED - Condiciones sub-estandar',
    useBom: false,
    removeNewLines: true
    //keys: ['approved','age','name' ]
  };

  optionsList3 = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: ['Fecha', 'Foto inicial', 'Observador - Usuario', 'Observador - Área', 'Área observada - Nombre', 'Área observada - Supervisor', 'Personal observado - Usuario', 'Personal observado - Área', 'Acto destacable', 'Mejora', 'Estado', 'Porcentaje', 'Fecha Propuesta', 'Fecha cierre', 'Foto final'],
    showTitle: true,
    title: 'FRED - Actos destacados',
    useBom: false,
    removeNewLines: true
    //keys: ['approved','age','name' ]
  };

  titleList1: string = '';
  titleList2: string = '';
  titleList3: string = '';

  downloadableList1 = [];
  downloadableList2 = [];
  downloadableList3 = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    public auth: AuthService,
    private datePipe: DatePipe
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

    // ****************  TAB - FRED LIST
    let dataSecurityFredsSub = this.dbs.currentDataSecurityFreds.subscribe(res => {
      this.filteredFreds = res;
    });

    this.subscriptions.push(dataSecurityFredsSub);

    let dataSecurityFredCat1Sub = this.dbs.currentDataSecuritySubstandardActFreds
      .pipe(
        tap(res => {
          this.downloadableList1 = [];
          res.forEach(element => {
            // Initializing _object
            let _object = {}

            // Adding registration date and hours
            _object['fecha'] = this.datePipe.transform(new Date(element['regDate']), 'dd/MM/yyyy hh:mm');

            // Adding observations
            let _obs1 = '---';
            let _obs2 = '---';
            let _obs3 = '---';
            let _obs4 = '---';
            let _obs5 = '---';

            element['observations'].forEach(obs => {
              if(obs['group'] === "Orden y Limpieza"){
                _obs1 = obs['observations'][0];
              }
              if(obs['group'] === "Equipos de Protección Personal"){
                _obs2 = obs['observations'][0];
              }
              if(obs['group'] === "Control de Riesgos Operacionales"){
                _obs3 = obs['observations'][0];
              }
              if(obs['group'] === "Herramientas y Equipos"){
                _obs4 = obs['observations'][0];
              }
              if(obs['group'] === "Riesgos Críticos"){
                _obs5 = obs['observations'][0];
              }
            })

            _object['obsList1'] = _obs1;
            _object['obsList2'] = _obs2;
            _object['obsList3'] = _obs3;
            _object['obsList4'] = _obs4;
            _object['obsList5'] = _obs5;

            // Adding initial picture
            _object['foto inicial'] = element['initialPicture'] ? element['initialPicture'] : '---';

            // Adding observer user
            _object['observador usuario'] = element['createdBy']['displayName'];

            // Adding observer area
            _object['observador area'] = element['createdBy']['area']['name'];

            // Adding observed area name
            _object['area observada nombre'] = element['observedArea']['name'];

            // Adding observed area supervisor
            _object['area observada supervisor'] = element['observedArea']['supervisor']['displayName'];

            // Adding observed staff user
            _object['personal observado usuario'] = element['observedStaff']['displayName'];

            // Adding observed staff area
            _object['personal observado area'] = element['observedStaff']['area']['name'];

            // Adding sub-standard act
            _object['acto subestandar'] = element['substandardAct'] ? element['substandardAct'] : '---';

            // Adding upgrade opportunity
            _object['oportunidad de mejora'] = element['upgradeOpportunity'] ? element['upgradeOpportunity'] : '---';

            // Adding status
            _object['estado'] = element['status'] ? element['status'] : '---';

            // Adding percentage
            _object['porcentaje'] = element['percent'] ? element['percent'] : '---';

            // Adding estimated date
            _object['fecha propuesta cierre'] = element['estimatedTerminationDate'] ? this.datePipe.transform(new Date(element['estimatedTerminationDate']), 'dd/MM/yyyy') : '---';

            // Adding real date
            _object['fecha real cierre'] = element['realTerminationDate'] ? this.datePipe.transform(new Date(element['realTerminationDate']), 'dd/MM/yyyy') : '---';

            // Adding final picture
            _object['foto final'] = element['finalPicture'] ? element['finalPicture'] : '---';

            this.downloadableList1.push(_object);
          });
        })
      )
      .subscribe(res => {
        this.filteredSubstandardActFreds = res;
        this.dataSourceSubstandardAct.data = res;
        this.filteredSubstandardActFreds.forEach(element => {
          this.isOpenSubstandardAct.push(false);
        })
      })

    this.subscriptions.push(dataSecurityFredCat1Sub);

    let dataSecurityFredCat2Sub = this.dbs.currentDataSecuritySubstandardConditionFreds
      .pipe(
        tap(res => {
          this.downloadableList2 = [];
          res.forEach(element => {
            // Initializing _object
            let _object = {}

            // Adding date with format
            _object['fecha'] = this.datePipe.transform(new Date(element['regDate']), 'dd/MM/yyyy hh:mm:ss');

            // Adding initial picture
            _object['foto inicial'] = element['initialPicture'] ? element['initialPicture'] : '---';

            // Adding observer user
            _object['observador usuario'] = element['createdBy']['displayName'];

            // Adding observer area
            _object['observador area'] = element['createdBy']['area']['name'];

            // Adding observed area name
            _object['area observada nombre'] = element['observedArea']['name'];

            // Adding observed area supervisor
            _object['area observada supervisor'] = element['observedArea']['supervisor']['displayName'];

            // Adding observed staff user
            _object['personal observado usuario'] = element['observedStaff']['displayName'];

            // Adding observed staff area
            _object['personal observado area'] = element['observedStaff']['area']['name'];

            // Adding sub-standard condition
            _object['condicion subestandar'] = element['substandardCondition'] ? element['substandardCondition'] : '---';

            // Adding upgrade opportunity
            _object['oportunidad de mejora'] = element['upgradeOpportunity'] ? element['upgradeOpportunity'] : '---';

            // Adding status
            _object['estado'] = element['status'] ? element['status'] : '---';

            // Adding percentage
            _object['porcentaje'] = element['percent'] ? element['percent'] : '---';

            // Adding estimated date
            _object['fecha propuesta cierre'] = element['estimatedTerminationDate'] ? this.datePipe.transform(new Date(element['estimatedTerminationDate']), 'dd/MM/yyyy hh:mm:ss') : '---';

            // Adding real date
            _object['fecha real cierre'] = element['realTerminationDate'] ? this.datePipe.transform(new Date(element['realTerminationDate']), 'dd/MM/yyyy hh:mm:ss') : '---';      

            // Adding final picture
            _object['foto final'] = element['finalPicture'] ? element['finalPicture'] : '---';

            this.downloadableList2.push(_object);
          });
        })
      )
      .subscribe(res => {
        this.filteredSubstandardConditionFreds = res;
        this.dataSourceSubstandardCondition.data = res;
        this.filteredSubstandardConditionFreds.forEach(element => {
          this.isOpenSubstandardCondition.push(false);
        })
      })

    this.subscriptions.push(dataSecurityFredCat2Sub);

    let dataSecurityFredCat3Sub = this.dbs.currentDataSecurityRemarkableActFreds
    .pipe(
        tap(res => {
          this.downloadableList3 = [];
          res.forEach(element => {
            // Initializing _object
            let _object = {}

            // Adding date with format
            _object['fecha'] = this.datePipe.transform(new Date(element['regDate']), 'dd/MM/yyyy hh:mm:ss');

            // Adding initial picture
            _object['foto inicial'] = element['initialPicture'] ? element['initialPicture'] : '---';

            // Adding observer user
            _object['observador usuario'] = element['createdBy']['displayName'];

            // Adding observer area
            _object['observador area'] = element['createdBy']['area']['name'];

            // Adding observed area name
            _object['area observada nombre'] = element['observedArea']['name'];

            // Adding observed area supervisor
            _object['area observada supervisor'] = element['observedArea']['supervisor']['displayName'];

            // Adding observed staff user
            _object['personal observado usuario'] = element['observedStaff']['displayName'];

            // Adding observed staff area
            _object['personal observado area'] = element['observedStaff']['area']['name'];

            // Adding remarkable act
            _object['acto destacable'] = element['remarkableAct'] ? element['remarkableAct'] : '---';

            // Adding upgrade opportunity
            _object['oportunidad de mejora'] = element['upgradeOpportunity'] ? element['upgradeOpportunity'] : '---';

            // Adding status
            _object['estado'] = element['status'] ? element['status'] : '---';

            // Adding percentage
            _object['porcentaje'] = element['percent'] ? element['percent'] : '---';

            // Adding estimated date
            _object['fecha propuesta cierre'] = element['estimatedTerminationDate'] ? this.datePipe.transform(new Date(element['estimatedTerminationDate']), 'dd/MM/yyyy hh:mm:ss') : '---';

            // Adding real date
            _object['fecha real cierre'] = element['realTerminationDate'] ? this.datePipe.transform(new Date(element['realTerminationDate']), 'dd/MM/yyyy hh:mm:ss') : '---'; 

            // Adding final picture
            _object['foto final'] = element['finalPicture'] ? element['finalPicture'] : '---';

            this.downloadableList3.push(_object);
          });
        })
      )
    .subscribe(res => {
      this.filteredRemarkableActFreds = res;
      this.dataSourceRemarkableAct.data = res;
      this.filteredRemarkableActFreds.forEach(element => {
        this.isOpenRemarkableAct.push(false);
      })
    })

    this.subscriptions.push(dataSecurityFredCat3Sub);

  }

  ngOnInit() {
    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();

    this.titleList1 = 'Seguridad_Fred_ASub_' + this.currentMonth + '_' + this.currentYear;

    this.titleList2 = 'Seguridad_Fred_CSub_' + this.currentMonth + '_' + this.currentYear;

    this.titleList3 = 'Seguridad_Fred_ADes_' + this.currentMonth + '_' + this.currentYear;
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

    if (toMonth + 1 >= 13) {
      toYear++;
    }

    let toDate: Date = new Date(toYear, toMonth, 1);

    this.dbs.getSecuritySubstandardActFreds(this.auth.permits['securityFredPersonalList'], fromDate.valueOf(), toDate.valueOf());
    this.dbs.getSecuritySubstandardConditionFreds(this.auth.permits['securityFredPersonalList'], fromDate.valueOf(), toDate.valueOf());
    this.dbs.getSecurityRemarkableActFreds(this.auth.permits['securityFredPersonalList'], fromDate.valueOf(), toDate.valueOf());

    datepicker.close();
  }

  show(event): void {
    console.log(event);
  }

  createForms(): void {
    this.firstFormGroup = this.fb.group({
      type: ['', [Validators.required]],
      observedArea: ['', [Validators.required]],
      observedStaff: ['', [Validators.required]]
    });

    this.secondFormGroup = this.fb.group({
      list1: ['No observado', [Validators.required]],
      list2: ['No observado', [Validators.required]],
      list3: ['No observado', [Validators.required]],
      list4: ['No observado', [Validators.required]],
      list5: ['No observado', [Validators.required]],
    });

    this.thirdFormGroup = this.fb.group({
      solved: false,
      substandardAct: '',
      substandardCondition: '',
      remarkableAct: '',
      upgradeOpportunity: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.dataSourceSubstandardAct.paginator = this.paginator.toArray()[0];
    this.dataSourceSubstandardAct.sort = this.sort.toArray()[0];

    this.dataSourceSubstandardCondition.paginator = this.paginator.toArray()[1];
    this.dataSourceSubstandardCondition.sort = this.sort.toArray()[1];

    this.dataSourceRemarkableAct.paginator = this.paginator.toArray()[2];
    this.dataSourceRemarkableAct.sort = this.sort.toArray()[2];
  }

  toggleCardSubstandardAct(index) {
    this.isOpenSubstandardAct[index] = !this.isOpenSubstandardAct[index];
  }

  toggleCardSubstandardCondition(index) {
    this.isOpenSubstandardCondition[index] = !this.isOpenSubstandardCondition[index];
  }

  toggleCardRemarkableAct(index) {
    this.isOpenRemarkableAct[index] = !this.isOpenRemarkableAct[index];
  }

  showSelectedStaff(staff): string | undefined {
    return staff ? staff['displayName'] : undefined;
  }

  selectedStaff(event): void {

  }

  showSelectedArea(area): string | undefined {
    return area ? area['name'] : undefined;
  }

  selectedArea(event): void {

  }


  save(): void {

    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      if (this.thirdFormGroup.value['solved'] === 'true') {
        this.thirdFormGroup.get('solved').setValue(true);
      }

      if (this.thirdFormGroup.value['solved'] === 'false') {
        this.thirdFormGroup.get('solved').setValue(false);
      }

      if (this.firstFormGroup.value['type'] === "Acto sub-estandar") {
        if (this.secondFormGroup.value['list1'] === 'No observado' &&
          this.secondFormGroup.value['list2'] === 'No observado' &&
          this.secondFormGroup.value['list3'] === 'No observado' &&
          this.secondFormGroup.value['list4'] === 'No observado' &&
          this.secondFormGroup.value['list5'] === 'No observado') {
          this.snackbar.open("Debe seleccionar por lo menos una OBSERVACIÓN", "Cerrar", {
            duration: 6000
          });

          return;
        }
      }

      if (!this.thirdFormGroup.valid) {
        this.snackbar.open("Debe sugerir una oportunidad de mejora", "Cerrar", {
          duration: 6000
        });

        return;
      }

      if (!this.selectedFile && (this.firstFormGroup.value['type'] === "Condición sub-estandar")) {
        this.snackbar.open("Adjunte una imagen para poder guardar el documento", "Cerrar", {
          duration: 6000
        });
        return;
      }

      let dialogRef = this.dialog.open(FredConfirmSaveComponent, {
        data: [this.firstFormGroup.value, this.secondFormGroup.value, this.thirdFormGroup.value, this.selectedFile]
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

  delete(id_fred, id_creator, id_staff, id_supervisor): void {

    this.dialog.open(FredConfirmDeleteComponent, {
      data: {
        id_fred: id_fred,
        id_creator: id_creator,
        id_staff: id_staff,
        id_supervisor: id_supervisor
      }
    });
  }

  edit(fred): void {
    this.dialog.open(FredEditDialogComponent, {
      data: fred,
      autoFocus: false
    })
  }

}
