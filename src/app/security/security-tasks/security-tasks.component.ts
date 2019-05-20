import { Component, OnInit, ViewChild, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth.service';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { SecurityTasksDialogProgressComponent } from './security-tasks-dialog-progress/security-tasks-dialog-progress.component';

@Component({
  selector: 'app-security-tasks',
  templateUrl: './security-tasks.component.html',
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
export class SecurityTasksComponent implements OnInit, OnDestroy {

  monthsKey: Array<string> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  monthIndex: number;
  currentMonth: string;
  currentYear: number;
  year: number;

  monthFormControl = new FormControl({ value: new Date(), disabled: true });

  displayedColumnsFredTasks: string[] = ['index', 'date', 'type', 'observations', 'initialPicture', 'observer', 'observedArea', 'staffObserved', 'eventDescription', 'upgradeOpportunity', 'status', 'percent', 'terminationDates', 'finalPicture', 'edit'];
  dataSourceFredTasks = new MatTableDataSource();

  displayedColumnsInspectionTasks: string[] = ['index', 'kindOfObservation', 'observationDescription', 'initialPicture', 'cause', 'recommendationDescription', 'area', 'responsibleArea', 'status', 'percent', 'terminationDate', 'finalPicture', 'edit'];
  dataSourceInspectionTasks = new MatTableDataSource();

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  date: Date = new Date();

  subscriptions: Array<Subscription> = [];

  filteredFredsTasks: Array<any> = [];
  isOpenFred: Array<any> = [];
  filteredObservationsTasks: Array<any> = [];
  isOpenObservation: Array<any> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();

    let fredTasksSub = this.dbs.currentDataSecurityTasks
      .pipe(
        map(res => {
          let tasksByFred = [];
          res.forEach(element => {
            if (element['source'] === 'fred') {
              tasksByFred.push(element);
            }
          });
          return tasksByFred;
        })
      )
      .subscribe(res => {
        this.filteredFredsTasks = res;
        this.dataSourceFredTasks.data = res;
        this.filteredFredsTasks.forEach(element => {
          this.isOpenFred.push(false);
        })
        console.log("FRED TASKS:", res);
      });

    this.subscriptions.push(fredTasksSub);

    let inspectionTasksSub = this.dbs.currentDataSecurityTasks
      .pipe(
        map(res => {
          let tasksByInspection = [];
          res.forEach(element => {
            if (element['source'] === 'inspection') {
              tasksByInspection.push(element);
            }
          });
          return tasksByInspection;
        })
      )
      .subscribe(res => {
        this.filteredObservationsTasks = res;
        this.dataSourceInspectionTasks.data = res;
        this.filteredObservationsTasks.forEach(element => {
          this.isOpenObservation.push(false);
        });
        console.log("INSPECTIONS TASKS:", res);
      });

    this.subscriptions.push(inspectionTasksSub);
  }

  ngAfterViewInit() {
    this.dataSourceFredTasks.paginator = this.paginator.toArray()[0];
    this.dataSourceFredTasks.sort = this.sort.toArray()[0];

    this.dataSourceInspectionTasks.paginator = this.paginator.toArray()[1];
    this.dataSourceInspectionTasks.sort = this.sort.toArray()[1];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleCardFred(index) {
    this.isOpenFred[index] = !this.isOpenFred[index];
  }

  toggleCardObservation(index) {
    this.isOpenObservation[index] = !this.isOpenObservation[index];
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

    this.dbs.getTasks(fromDate.valueOf(), toDate.valueOf());

    datepicker.close();
  }

  saveProgressOnTask(fred): void {
    this.dialog.open(SecurityTasksDialogProgressComponent, {
      data: {
        task: fred,
        type: 'fred'
      }
    });
  }

  saveProgressOnObservation(observation): void {
    console.log(observation)
    this.dialog.open(SecurityTasksDialogProgressComponent, {
      data: {
        task: observation,
        type: 'observation'
      }
    });
  }

}
