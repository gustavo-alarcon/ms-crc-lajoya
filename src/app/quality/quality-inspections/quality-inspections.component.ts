import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { state, trigger, style, transition, animate } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { map } from 'rxjs/operators';
import { QualityAddInspectionComponent } from './quality-add-inspection/quality-add-inspection.component';
import { QualityAddObservationToInspectionComponent } from './quality-add-observation-to-inspection/quality-add-observation-to-inspection.component';
import { QualityInspectionConfirmTerminationComponent } from './quality-inspection-confirm-termination/quality-inspection-confirm-termination.component';
import { QualityInspectionConfirmDeleteComponent } from './quality-inspection-confirm-delete/quality-inspection-confirm-delete.component';
import { QualityInspectionObservationConfirmDeleteComponent } from './quality-inspection-observation-confirm-delete/quality-inspection-observation-confirm-delete.component';

@Component({
  selector: 'app-quality-inspections',
  templateUrl: './quality-inspections.component.html',
  animations: [
    trigger('openCloseCard',[
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
    trigger('openCloseToolbar',[
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
    trigger('openCloseTable',[
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
    trigger('openCloseTableMobile',[
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

  monthsKey: Array<string> = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  monthIndex: number;
  currentMonth: string;
  currentYear: number;
  year: number;

  monthFormControl = new FormControl({value:new Date(), disabled: true});

  displayedColumns: string[] = ['index', 'terminationDate', 'date', 'inspector', 'area', 'edit'];
  dataSource = new MatTableDataSource();

  displayedColumnsInspectionObservations: string[] = ['index', 'kindOfDanger', 'kindOfObservation', 'observationDescription', 'initialPicture', 'cause', 'recommendationDescription', 'area', 'terminationDate', 'percent', 'status', 'finalPicture', 'edit'];
  dataSourceQualityObservations = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filteredInspections: Array<any> = [];
  isOpenInspection: Array<any> = [];

  subscriptions: Array<Subscription> = [];

  constructor(
    private dialog: MatDialog,
    public dbs: DatabaseService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();

    let qualitySubs = this.dbs.currentDataQualityInspections
                            .pipe(
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
                              })
                            });

    this.subscriptions.push(qualitySubs);

    let qualityObservations =  this.dbs.currentDataQualityInspectionObservations
                                    .subscribe(res => {
                                      this.dataSourceQualityObservations.data = res;
                                    })

    this.subscriptions.push(qualityObservations);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.subscriptions.forEach( sub => sub.unsubscribe());
  }

  setMonthOfView(event, datepicker): void {
    this.monthFormControl = new FormControl({value:event, disabled:true});
    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();
    let fromDate: Date = new Date(this.currentYear, this.monthIndex, 1);

    let toMonth = (fromDate.getMonth()+ 1) % 12;
    let toYear = this.currentYear;

    if(toMonth + 1 >= 13){
      toYear ++;
    }

    let toDate: Date = new Date(toYear, toMonth, 1);

    this.dbs.getQualityInspections(false, fromDate.valueOf(), toDate.valueOf());

    datepicker.close();
  }

  toggleCardInspection(index, id_inspection) {
    this.requestInspectionObservations(id_inspection);
    this.isOpenInspection[index] = !this.isOpenInspection[index];
  }

  addInspection(): void{
    this.dialog.open(QualityAddInspectionComponent);
  }

  requestInspectionObservations(id): void{
    this.dbs.getInspectionObservations(id);
  }

  addObservation(inspectionData): void{
    this.dialog.open(QualityAddObservationToInspectionComponent, {
      data: inspectionData
    });
  }

  terminateInspection(id_inspection): void{
    console.log(id_inspection);
    this.dialog.open(QualityInspectionConfirmTerminationComponent,{
      data: {
        id_inspection: id_inspection
      }
    })

  }

  deleteInspection(id_inspection): void{
    this.dialog.open(QualityInspectionConfirmDeleteComponent, {
      data: {
        id_inspection: id_inspection
      }
    });
  }

  deleteObservation(id_inspection, id_observation): void{
    this.dialog.open(QualityInspectionObservationConfirmDeleteComponent,{
      data:{
        id_inspection: id_inspection,
        id_observation: id_observation
      }
    })
  }

}
