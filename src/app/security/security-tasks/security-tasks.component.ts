import { Component, OnInit, ViewChild, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-security-tasks',
  templateUrl: './security-tasks.component.html',
  styles: []
})
export class SecurityTasksComponent implements OnInit, OnDestroy {

  displayedColumnsFredTasks: string[] = ['index', 'date', 'type', 'observations', 'initialPicture', 'observer', 'observedArea', 'staffObserved', 'eventDescription', 'upgradeOpportunity', 'status', 'percent', 'terminationDates', 'finalPicture', 'edit'];
  dataSourceFredTasks = new MatTableDataSource();

  displayedColumnsInspectionTasks: string[] = ['index', 'kindOfDanger', 'kindOfObservation', 'observationDescription', 'initialPicture', 'cause', 'recommendationDescription', 'area', 'status', 'percent', 'terminationDate', 'finalPicture', 'edit'];
  dataSourceInspectionTasks = new MatTableDataSource();

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  date: Date = new Date();

  subscriptions: Array<Subscription> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    let fredTasksSub = this.dbs.currentDataSecurityTasks
      .pipe(
        map(res => {
          let tasksByFred = [];
          res.forEach(element => {
            if(element['source'] === 'fred'){
              tasksByFred.push(element);
            }
          });
          return tasksByFred;
        })
      )
      .subscribe(res => {
        this.dataSourceFredTasks.data = res;
      });

    this.subscriptions.push(fredTasksSub);

    let inspectionTasksSub = this.dbs.currentDataSecurityTasks
      .pipe(
        map(res => {
          let tasksByInspection = [];
          res.forEach(element => {
            if(element['source'] === 'inspection'){
              tasksByInspection.push(element);
            }
          });
          return tasksByInspection;
        })
      )
      .subscribe(res => {
        this.dataSourceInspectionTasks.data = res;
      });

    this.subscriptions.push(inspectionTasksSub);
  }

  ngAfterViewInit(){
    this.dataSourceFredTasks.paginator = this.paginator.toArray()[0];
    this.dataSourceFredTasks.sort = this.sort.toArray()[0];

    this.dataSourceInspectionTasks.paginator = this.paginator.toArray()[1];
    this.dataSourceInspectionTasks.sort = this.sort.toArray()[1];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getTasks(){
    
  }

}
