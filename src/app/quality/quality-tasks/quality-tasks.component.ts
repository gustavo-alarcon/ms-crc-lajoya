import { Component, OnInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { QualityTasksDialogFinalizeComponent } from './quality-tasks-dialog-finalize/quality-tasks-dialog-finalize.component';
import { QualityTasksDialogFinalizeObservationComponent } from './quality-tasks-dialog-finalize-observation/quality-tasks-dialog-finalize-observation.component';
import { AuthService } from 'src/app/core/auth.service';
import { QualityTasksDialogFinalizeInspectionComponent } from './quality-tasks-dialog-finalize-inspection/quality-tasks-dialog-finalize-inspection.component';

@Component({
  selector: 'app-quality-tasks',
  templateUrl: './quality-tasks.component.html',
  animations: [
    trigger('openCloseCard', [
      state('open', style({
        height: '156px',
        opacity: 0.8,
        borderRadius: '10px 10px 0px 0px',
        marginBottom: '0em'
      })),
      state('closed', style({
        height: '156px',
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
        maxHeight: '20000px',
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
    ]),
  ]
})
export class QualityTasksComponent implements OnInit, OnDestroy {

  isOpenActions: Array<any> = [];
  isOpenInspections: Array<any> = [];
  isOpenSingleObservations: Array<any> = [];

  monthsKey: Array<string> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  monthIndex: number;
  currentMonth: string;
  currentYear: number;
  year: number;

  monthFormControl = new FormControl({ value: new Date(), disabled: true });

  displayedColumnsTasksByRedo: string[] = ['index', 'action', 'approved', 'responsibles', 'finalPicture', 'status', 'realTerminationDate', 'finalArchive', 'finalize'];
  dataSourceTasksByRedo = new MatTableDataSource();

  displayedColumnsTasksByInspections: string[] = ['index', 'observationDescription', 'recommendationDescription', 'initialPicture', 'area', 'responsibleArea', 'finalPicture', 'terminationDate', 'status', 'edit'];
  dataSourceTasksByInspections = new MatTableDataSource();

  displayedColumnsTasksBySingleObservations: string[] = ['index', 'observationDescription', 'recommendationDescription', 'initialPicture', 'area', 'responsibleArea', 'finalPicture', 'terminationDate', 'status', 'edit'];
  dataSourceTasksBySingleObservations = new MatTableDataSource();

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  subscriptions: Array<Subscription> = [];

  filteredRedosTasks: Array<any> = [];
  filteredInspectionsTasks: Array<any> = [];
  filteredSingleObservationsTasks: Array<any> = [];

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    public auth: AuthService
  ) { }

  ngOnInit() {

    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();

    let dataQualityTasksByRedosSubs = this.dbs.currentDataQualityTasks
      .pipe(
        map(res => {
          let tasksByRedo = [];
          res.forEach(element => {
            if (element['source'] === 'redo actions') {
              tasksByRedo.push(element);
            }
          });
          return tasksByRedo;
        })
      )
      .subscribe(res => {
        this.filteredRedosTasks = res;
        this.dataSourceTasksByRedo.data = res;
        res.forEach(element => {
          this.isOpenActions.push(false);
        })
      });

    this.subscriptions.push(dataQualityTasksByRedosSubs);

    let dataQualityTasksByInspectionsSubs = this.dbs.currentDataQualityTasks
      .pipe(
        map(res => {
          console.log(res);
          let tasksByInspectionObservation = [];
          res.forEach(element => {
            if (element['source'] === 'quality inspection') {
              tasksByInspectionObservation.push(element);
            }
          });
          return tasksByInspectionObservation;
        })
      )
      .subscribe(res => {
        this.filteredInspectionsTasks = res;
        this.dataSourceTasksByInspections.data = res;
        res.forEach(element => {
          this.isOpenInspections.push(false);
        })
      });

    this.subscriptions.push(dataQualityTasksByInspectionsSubs);

    let dataQualityTasksBySingleObservationSubs = this.dbs.currentDataQualitySingleObservations
      .subscribe(res => {
        this.filteredSingleObservationsTasks = res;
        this.dataSourceTasksBySingleObservations.data = res;
        res.forEach(element => {
          this.isOpenSingleObservations.push(false);
        })
      });

    this.subscriptions.push(dataQualityTasksBySingleObservationSubs);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit() {
    this.dataSourceTasksByRedo.paginator = this.paginator.toArray()[0];
    this.dataSourceTasksByRedo.sort = this.sort.toArray()[0];

    this.dataSourceTasksByInspections.paginator = this.paginator.toArray()[1];
    this.dataSourceTasksByInspections.sort = this.sort.toArray()[1];

    this.dataSourceTasksBySingleObservations.paginator = this.paginator.toArray()[2];
    this.dataSourceTasksBySingleObservations.sort = this.sort.toArray()[2];
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

    this.dbs.getQualityTasks(fromDate.valueOf(), toDate.valueOf());

    datepicker.close();
  }

  toggleCardActions(index) {
    this.isOpenActions[index] = !this.isOpenActions[index];
  }

  toggleCardInspections(index) {
    this.isOpenInspections[index] = !this.isOpenInspections[index];
  }

  toggleCardSingleObservations(index) {
    this.isOpenSingleObservations[index] = !this.isOpenSingleObservations[index];
  }

  finalizeTask(task): void {
    let dialogRef = this.dialog.open(QualityTasksDialogFinalizeComponent, {
      data: task
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        dialogRef.close();
      }
    })

  }

  finalizeTaskObservation(task): void {
    let dialogRef = this.dialog.open(QualityTasksDialogFinalizeObservationComponent, {
      data: task
    })
  }

  finalizeTaskInspection(task): void {
    let dialogRef = this.dialog.open(QualityTasksDialogFinalizeInspectionComponent, {
      data: task
    })
  }





}
