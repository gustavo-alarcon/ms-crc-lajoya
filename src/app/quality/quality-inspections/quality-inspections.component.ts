import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { state, trigger, style, transition, animate } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { map, tap } from 'rxjs/operators';
import { QualityAddInspectionComponent } from './quality-add-inspection/quality-add-inspection.component';
import { QualityAddObservationToInspectionComponent } from './quality-add-observation-to-inspection/quality-add-observation-to-inspection.component';
import { QualityInspectionConfirmTerminationComponent } from './quality-inspection-confirm-termination/quality-inspection-confirm-termination.component';
import { QualityInspectionConfirmDeleteComponent } from './quality-inspection-confirm-delete/quality-inspection-confirm-delete.component';
import { QualityInspectionObservationConfirmDeleteComponent } from './quality-inspection-observation-confirm-delete/quality-inspection-observation-confirm-delete.component';
import { QualityDialogAddSingleObservationComponent } from './quality-dialog-add-single-observation/quality-dialog-add-single-observation.component';
import { QualityConfirmDeleteSingleObservationComponent } from './quality-confirm-delete-single-observation/quality-confirm-delete-single-observation.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-quality-inspections',
  templateUrl: './quality-inspections.component.html',
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
export class QualityInspectionsComponent implements OnInit, OnDestroy {

  panelOpenState: Array<boolean> = [];

  monthsKey: Array<string> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  monthIndex: number;
  currentMonth: string;
  currentYear: number;
  year: number;

  monthFormControl = new FormControl({ value: new Date(), disabled: true });

  displayedColumns: string[] = ['index', 'terminationDate', 'date', 'inspector', 'area', 'edit'];
  dataSource = new MatTableDataSource();

  displayedColumnsInspectionObservations: string[] = ['index', 'observationDescription', 'recommendationDescription', 'initialPicture', 'area', 'responsibleArea', 'finalPicture', 'terminationDate', 'status', 'edit'];
  dataSourceQualityObservations = new MatTableDataSource();

  displayedColumnsQualitySingleObservations: string[] = ['index', 'observationDescription', 'recommendationDescription', 'initialPicture', 'area', 'responsibleArea', 'finalPicture', 'terminationDate', 'status', 'edit'];
  dataSourceQualitySingleObservations = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filteredInspections: Array<any> = [];
  filteredSingleObservations: Array<any> = [];
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

  optionsInspectionsObservations = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    headers: ['Fecha de inspección','Inspector - Usuario', 'Área - Nombre', 'Descripción de la observación', 'Recomendación', 'Foto inicial', 'Área observada - Nombre', 'Área observada - Supervisor',  'Área responsable - Nombre', 'Área responsable - Supervisor', 'Foto final', 'Fecha propuesta', 'Fecha real', 'Estado'],
    showTitle: true,
    title: '',
    useBom: false,
    removeNewLines: true
    //keys: ['approved','age','name' ]
  };

  optionsSingleObservations = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    headers: ['Descripción de la observación', 'Recomendación', 'Foto inicial', 'Área observada - Nombre', 'Área observada - Supervisor',  'Área responsable - Nombre', 'Área responsable - Supervisor', 'Foto final', 'Fecha propuesta', 'Fecha real', 'Estado'],
    showTitle: true,
    title: '',
    useBom: false,
    removeNewLines: true
    //keys: ['approved','age','name' ]
  };

  titleInspections: string = '';
  titleInspectionsObservations: string = '';
  titleSingleObservations: string = '';

  downloadableInspections = [];
  downloadableInspectionsObservations = [];
  downloadableSingleObservations = [];

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

    this.titleInspections = 'Calidad_Cronograma_Inspecciones_' + this.currentMonth + '_' + this.currentYear;

    this.optionsInspections['title'] = 'Calidad - Inspecciones ' + this.currentMonth + ' ' + this.currentYear;

    this.titleInspectionsObservations = 'Calidad_Observaciones_Inspecciones_' + this.currentMonth + '_' + this.currentYear;

    this.optionsInspectionsObservations['title'] = 'Calidad - Observaciones en Inspecciones ' + this.currentMonth + ' ' + this.currentYear;

    this.titleSingleObservations = 'Calidad_Observaciones_Personales_' + this.currentMonth + '_' + this.currentYear;

    this.optionsSingleObservations['title'] = 'Calidad - Observaciones Personales ' + this.currentMonth + ' ' + this.currentYear;

    let qualitySubs = this.dbs.currentDataQualityInspections
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

    this.subscriptions.push(qualitySubs);

    let qualityObservations = this.dbs.currentDataQualityInspectionObservations
      .subscribe(res => {
        this.dataSourceQualityObservations.data = res;
      })

    this.subscriptions.push(qualityObservations);

    let qualitySingleObservationsSubs = this.dbs.currentDataQualitySingleObservations
      .pipe(
        tap(res => {
          this.downloadableSingleObservations = [];
          res.forEach(observation => {
              // Initializing _object
              let _object = {}

              // Adding observation description
              _object['observationDescription'] = observation['observationDescription'] ? observation['observationDescription'] : '---';

              // Adding recommendation description
              _object['recommendationDescription'] = observation['recommendationDescription'] ? observation['recommendationDescription'] : '---';

              // Adding initial picture link
              _object['initialPicture'] = observation['initialPicture'] ? observation['initialPicture'] : '---';

              // Adding area - name
              _object['areaObservationName'] = observation['area']['name'] ? observation['area']['name'] : '---';

              // Adding area - supervisor
              _object['areaSupervisor'] = observation['area']['supervisor']['displayName'];

              // Adding area - name
              _object['areaResponsibleName'] = observation['responsibleArea']['name'] ? observation['responsibleArea']['name'] : '---';

              // Adding area - supervisor
              _object['areResponsibleaSupervisor'] = observation['responsibleArea']['supervisor']['displayName'] ? observation['responsibleArea']['supervisor']['displayName'] : '---';

              // Adding final picture link
              _object['finalPicture'] = observation['finalPicture'] ? observation['finalPicture'] : '---';

              // Adding observation estimated date
              _object['obsEstimatedTerminationDate'] = observation['estimatedTerminationDate'] ? this.datePipe.transform(new Date(observation['estimatedTerminationDate']), 'dd/MM/yyyy') : '---';

              // Adding observation real date
              _object['obsRealTerminationDate'] = observation['realTerminationDate'] ? this.datePipe.transform(new Date(observation['realTerminationDate']), 'dd/MM/yyyy') : '---';

              // Adding status
              _object['status'] = observation['status'] ? observation['status'] : '---';

              

              this.downloadableSingleObservations.push(_object);
          })
        })
      )
      .subscribe(res => {
        this.dataSourceQualitySingleObservations.data = res;
      })

    this.subscriptions.push(qualitySingleObservationsSubs);

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

    this.dbs.getQualityInspections(false, fromDate.valueOf(), toDate.valueOf());

    datepicker.close();
  }

  downloadObservations(inspections): void {
    this.downloadableInspectionsObservations = [];
    inspections.forEach((inspection, index) => {
      if (inspection['id']) {
        this.dbs.qualityInspectionsCollection
          .doc(inspection['id'])
          .collection('observations').get().forEach(snapshot => {

            snapshot.docs.forEach(doc => {
              let observation = doc.data();
              // Initializing _object
              let _object = {}

              // Adding inspection date
              _object['estimatedTerminationDate'] = inspection['estimatedTerminationDate'] ? this.datePipe.transform(new Date(inspection['estimatedTerminationDate']), 'dd/MM/yyyy') : '---';

              // Adding inspector - user
              _object['inspectorDisplayName'] = inspection['inspector']['displayName'];

              // Adding area of inspection - name
              _object['areaInspectionName'] = inspection['area']['name'];

              // Adding observation description
              _object['observationDescription'] = observation['observationDescription'] ? observation['observationDescription'] : '---';

              // Adding recommendation description
              _object['recommendationDescription'] = observation['recommendationDescription'] ? observation['recommendationDescription'] : '---';

              // Adding initial picture link
              _object['initialPicture'] = observation['initialPicture'] ? observation['initialPicture'] : '---';

              // Adding area - name
              _object['areaObservationName'] = observation['area']['name'] ? observation['area']['name'] : '---';

              // Adding area - supervisor
              _object['areaSupervisor'] = observation['area']['supervisor']['displayName'];

              // Adding area - name
              _object['areaResponsibleName'] = observation['responsibleArea']['name'] ? observation['responsibleArea']['name'] : '---';

              // Adding area - supervisor
              _object['areResponsibleaSupervisor'] = observation['responsibleArea']['supervisor']['displayName'] ? observation['responsibleArea']['supervisor']['displayName'] : '---';

              // Adding final picture link
              _object['finalPicture'] = observation['finalPicture'] ? observation['finalPicture'] : '---';

              // Adding observation estimated date
              _object['obsEstimatedTerminationDate'] = observation['estimatedTerminationDate'] ? this.datePipe.transform(new Date(observation['estimatedTerminationDate']), 'dd/MM/yyyy') : '---';

              // Adding observation real date
              _object['obsRealTerminationDate'] = observation['realTerminationDate'] ? this.datePipe.transform(new Date(observation['realTerminationDate']), 'dd/MM/yyyy') : '---';

              // Adding status
              _object['status'] = observation['status'] ? observation['status'] : '---';

              this.downloadableInspectionsObservations.push(_object);
            })
          })
      }

    })

  }

  toggleCardInspection(index, id_inspection) {
    this.requestQualityInspectionObservations(id_inspection);
    this.isOpenInspection[index] = !this.isOpenInspection[index];
  }

  addInspection(): void {
    this.dialog.open(QualityAddInspectionComponent);
  }

  requestQualityInspectionObservations(id): void {
    this.dbs.getQualityInspectionObservations(id);
  }

  addObservation(inspectionData): void {
    let addObsSubs = this.dialog.open(QualityAddObservationToInspectionComponent, {
      data: inspectionData
    }).afterClosed().subscribe( res => {
      this.downloadObservations(this.filteredInspections);
    })

    this.subscriptions.push(addObsSubs);
  }

  terminateInspection(id_inspection): void {
    this.dialog.open(QualityInspectionConfirmTerminationComponent, {
      data: {
        id_inspection: id_inspection
      }
    })

  }

  deleteInspection(id_inspection): void {
    this.dialog.open(QualityInspectionConfirmDeleteComponent, {
      data: {
        id_inspection: id_inspection
      }
    });
  }

  deleteObservation(id_inspection, id_observation, id_supervisor): void {
    let deleteObsSubs = this.dialog.open(QualityInspectionObservationConfirmDeleteComponent, {
      data: {
        id_inspection: id_inspection,
        id_observation: id_observation,
        id_supervisor: id_supervisor
      }
    }).afterClosed().subscribe(res => {
      this.downloadObservations(this.filteredInspections);
    });

    this.subscriptions.push(deleteObsSubs);
  }

  addSingleObservation(): void {
    this.dialog.open(QualityDialogAddSingleObservationComponent)
  }

  deleteSingleObservation(id_observation, id_supervisor): void {
    this.dialog.open(QualityConfirmDeleteSingleObservationComponent, {
      data: {
        id_observation: id_observation,
        id_supervisor: id_supervisor
      }
    })
  }

}
