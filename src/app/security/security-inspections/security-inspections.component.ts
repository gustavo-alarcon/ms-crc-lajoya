import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { AddInspectionComponent } from './add-inspection/add-inspection.component';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { map, tap } from 'rxjs/operators';
import { AddObservationToInspectionComponent } from './add-observation-to-inspection/add-observation-to-inspection.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';
import { SecurityInspectionConfirmDeleteComponent } from './security-inspection-confirm-delete/security-inspection-confirm-delete.component';
import { SecurityInspectionObservationConfirmDeleteComponent } from './security-inspection-observation-confirm-delete/security-inspection-observation-confirm-delete.component';
import { SecurityInspectionConfirmTerminationComponent } from './security-inspection-confirm-termination/security-inspection-confirm-termination.component';
import { AuthService } from 'src/app/core/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-security-inspections',
  templateUrl: './security-inspections.component.html',
  animations: [
    trigger('openCloseCard', [
      state('openCard', style({
        borderRadius: '8px 8px 0px 0px',
        marginBottom: '0px'
      })),
      state('closedCard', style({
        borderRadius: '8px',
        marginBottom: '1em'
      })),
      transition('openCard => closedCard', [
        animate('1s ease-in')
      ]),
      transition('closedCard => openCard', [
        animate('0.5s ease-in')
      ])
    ]),
    trigger('openCloseToolbar', [
      state('openToolbar', style({
        height: '60px',
        opacity: 1
      })),
      state('closedToolbar', style({
        height: '0px',
        opacity: 0
      })),
      transition('openToolbar => closedToolbar', [
        animate('1s ease-in')
      ]),
      transition('closedToolbar => openToolbar', [
        animate('0.5s ease-in')
      ])
    ]),
    trigger('openCloseTable', [
      state('openTable', style({
        maxHeight: '4000px',
        opacity: 1
      })),
      state('closedTable', style({
        height: '0px',
        opacity: 0
      })),
      transition('openTable => closedTable', [
        animate('1s ease-in')
      ]),
      transition('closedTable => openTable', [
        animate('0.5s ease-in')
      ])
    ]),
    trigger('openCloseTableMobile', [
      state('openTableMobile', style({
        maxHeight: '10000px',
        opacity: 1,
        marginBottom: '1em'
      })),
      state('closedTableMobile', style({
        height: '0px',
        opacity: 0,
        marginBottom: '0em',
        display: 'none'
      })),
      transition('openTableMobile => closedTableMobile', [
        animate('1s ease-in')
      ]),
      transition('closedTableMobile => openTableMobile', [
        animate('0.5s ease-in')
      ])
    ])
  ]
})
export class SecurityInspectionsComponent implements OnInit {

  panelOpenState: Array<boolean> = [];

  monthsKey: Array<string> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  monthIndex: number;
  currentMonth: string;
  currentYear: number;
  year: number;

  monthFormControl = new FormControl({ value: new Date(), disabled: true });

  displayedColumns: string[] = ['index', 'terminationDate', 'date', 'inspector', 'area', 'edit'];
  dataSource = new MatTableDataSource();

  displayedColumnsInspectionObservations: string[] = ['index', 'kindOfObservation', 'observationDescription', 'initialPicture', 'cause', 'recommendationDescription', 'area', 'terminationDate', 'percent', 'status', 'finalPicture', 'edit'];
  dataSourceInspectionObservations = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filteredInspections: Array<any> = [];
  isOpenInspection: Array<any> = [];

  optionsInspections = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    headers: ['Fecha de inspección', 'Fecha realizada', 'Fecha de creación', 'Inspector - Usuario', 'Inspector - Área', 'Área - Nombre', 'Área - Supervisor', 'Estado'],
    showTitle: true,
    title: '',
    useBom: false,
    removeNewLines: true
    //keys: ['approved','age','name' ]
  };

  optionsObservations = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    headers: ['Fecha de inspección', 'Inspector - Usuario', 'Área - Nombre', 'Tipo de observación', 'Descripción de la obsrvación', 'Foto inicial', 'Causa', 'Recomendaciones', 'Área - Nombre', 'Área - Supervisor', 'Fecha propuesta', 'Fecha real', 'Porcentaje', 'Estado', 'Foto final'],
    showTitle: true,
    title: '',
    useBom: false,
    removeNewLines: true
    //keys: ['approved','age','name' ]
  };

  titleInspections: string = '';
  titleObservations: string = '';

  downloadableInspections = [];
  downloadableObservations = [];

  subscriptions: Array<Subscription> = [];

  constructor(
    private dialog: MatDialog,
    public dbs: DatabaseService,
    public auth: AuthService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();

    this.titleInspections = 'Seguridad_Cronograma_Inspecciones_' + this.currentMonth + '_' + this.currentYear;

    this.optionsInspections['title'] = 'Seguridad - Inspecciones ' + this.currentMonth + ' ' + this.currentYear;

    this.titleObservations = 'Seguridad_Observaciones_Inspecciones_' + this.currentMonth + '_' + this.currentYear;

    this.optionsObservations['title'] = 'Seguridad - Observaciones en Inspecciones ' + this.currentMonth + ' ' + this.currentYear;

    let inspectionsSubs = this.dbs.currentDataSecurityInspections
      .pipe(
        tap(res => {
          this.downloadableInspections = [];
          res.forEach(element => {
            // Initializing _object
            let _object = {}

            // Adding inspection date
            _object['fecha estimada'] = element['estimatedTerminationDate'] ? this.datePipe.transform(new Date(element['estimatedTerminationDate']), 'dd/MM/yyyy') : '---';

            // Adding real date
            _object['fecha real'] = element['realTerminationDate'] ? this.datePipe.transform(new Date(element['realTerminationDate']), 'dd/MM/yyyy') : '---';

            // Adding date with format
            _object['fecha'] = this.datePipe.transform(new Date(element['regDate']), 'dd/MM/yyyy');

            // Adding inspector - user
            _object['inspector usuario'] = element['inspector']['displayName'];

            // Adding inspector - area
            _object['inspector area'] = element['inspector']['area']['name'];

            // Adding area of inspection - name
            _object['area inspeccion nombre'] = element['area']['name'];

            // Adding area of inspection - supervisor
            _object['area inspecion supervisor'] = element['area']['supervisor']['displayName'];

            // Adding inspection status
            _object['estado'] = element['status'];

            this.downloadableInspections.push(_object);

          });
        }),
        map(res => {
          res.forEach(element => {
            this.panelOpenState.push(false);
          });
          return res
        })
      )
      .subscribe(res => {
        this.filteredInspections = res;
        this.dataSource.data = res;
        this.filteredInspections.forEach(element => {
          this.isOpenInspection.push(false);
        });
        this.downloadObservations(res);
      });

    this.subscriptions.push(inspectionsSubs);

    let inspectionObservations = this.dbs.currentDataSecurityInspectionObservations
      .subscribe(res => {
        this.dataSourceInspectionObservations.data = res;
      })

    this.subscriptions.push(inspectionObservations);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

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

    this.dbs.getSecurityInspections(false, fromDate.valueOf(), toDate.valueOf());

    datepicker.close();
  }

  downloadObservations(inspections): void {
    this.downloadableObservations = [];
    inspections.forEach((inspection, index) => {
      // console.log('Inspection ' + index + ': ', inspection);
      if (inspection['id']) {
        this.dbs.securityInspectionsCollection
          .doc(inspection['id'])
          .collection('observations').get().forEach(snapshot => {

            snapshot.docs.forEach(doc => {
              let observation = doc.data();
              // console.log(observation);
              // Initializing _object
              let _object = {}

              // Adding inspection date
              _object['estimatedTerminationDate'] = inspection['estimatedTerminationDate'] ? this.datePipe.transform(new Date(inspection['estimatedTerminationDate']), 'dd/MM/yyyy') : '---';

              // Adding inspector - user
              _object['inspectorDisplayName'] = inspection['inspector']['displayName'];

              // Adding area of inspection - name
              _object['areaInspectionName'] = inspection['area']['name'];

              // Adding kind of observation
              _object['kindOfObservation'] = observation['kindOfObservation'];

              // Adding observation description
              _object['observationDescription'] = observation['observationDescription'] ? observation['observationDescription'] : '---';

              // Adding initial picture link
              _object['initialPicture'] = observation['initialPicture'] ? observation['initialPicture'] : '---';

              // Adding cause
              _object['cause'] = observation['cause'];

              // Adding recommendation description
              _object['recommendationDescription'] = observation['recommendationDescription'] ? observation['recommendationDescription'] : '---';

              // Adding area - name
              _object['areaObservationName'] = observation['area']['name'] ? observation['area']['name'] : '---';

              // Adding area - supervisor
              _object['areaSupervisor'] = observation['area']['supervisor']['displayName'];

              // Adding observation estimated date
              _object['obsEstimatedTerminationDate'] = observation['estimatedTerminationDate'] ? this.datePipe.transform(new Date(observation['estimatedTerminationDate']), 'dd/MM/yyyy') : '---';

              // Adding observation real date
              _object['obsRealTerminationDate'] = observation['realTerminationDate'] ? this.datePipe.transform(new Date(observation['realTerminationDate']), 'dd/MM/yyyy') : '---';

              // Adding percent
              _object['percent'] = observation['percent'] ? observation['percent'] : '---';

              // Adding status
              _object['status'] = observation['status'] ? observation['status'] : '---';

              // Adding initial picture link
              _object['finalPicture'] = observation['finalPicture'] ? observation['finalPicture'] : '---';

              this.downloadableObservations.push(_object);
            })
          })
      }

    })

  }

  toggleCardInspection(index, id_inspection) {
    this.requestInspectionObservations(id_inspection);
    this.isOpenInspection[index] = !this.isOpenInspection[index];
  }

  addInspection(): void {
    this.dialog.open(AddInspectionComponent);
  }

  requestInspectionObservations(id): void {
    this.dbs.getInspectionObservations(id);
  }

  addObservation(inspectionData): void {
    this.dialog.open(AddObservationToInspectionComponent, {
      data: inspectionData
    }).afterClosed().subscribe(res => {
      this.downloadObservations(this.filteredInspections);
    })
  }

  terminateInspection(id_inspection): void {
    console.log(id_inspection);
    this.dialog.open(SecurityInspectionConfirmTerminationComponent, {
      data: {
        id_inspection: id_inspection
      }
    })

  }

  deleteInspection(id_inspection): void {
    this.dialog.open(SecurityInspectionConfirmDeleteComponent, {
      data: {
        id_inspection: id_inspection
      }
    });
  }

  deleteObservation(id_inspection, id_observation, id_supervisor): void {
    // console.log(id_supervisor);
    this.dialog.open(SecurityInspectionObservationConfirmDeleteComponent, {
      data: {
        id_inspection: id_inspection,
        id_observation: id_observation,
        id_supervisor: id_supervisor
      }
    }).afterClosed().subscribe(res => {
      this.downloadObservations(this.filteredInspections);
    })
  }

}
