import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { AddInspectionComponent } from './add-inspection/add-inspection.component';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { map } from 'rxjs/operators';
import { AddObservationToInspectionComponent } from './add-observation-to-inspection/add-observation-to-inspection.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';
import { SecurityInspectionConfirmDeleteComponent } from './security-inspection-confirm-delete/security-inspection-confirm-delete.component';
import { SecurityInspectionObservationConfirmDeleteComponent } from './security-inspection-observation-confirm-delete/security-inspection-observation-confirm-delete.component';
import { SecurityInspectionConfirmTerminationComponent } from './security-inspection-confirm-termination/security-inspection-confirm-termination.component';

@Component({
  selector: 'app-security-inspections',
  templateUrl: './security-inspections.component.html',
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
export class SecurityInspectionsComponent implements OnInit {

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
  dataSourceInspectionObservations = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filteredInspections: Array<any> = [];
  isOpenInspection: Array<any> = [];

  subscriptions: Array<Subscription> = [];

  constructor(
    private dialog: MatDialog,
    public dbs: DatabaseService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {

    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();

    let inspectionsSubs = this.dbs.currentDataSecurityInspections
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

    this.subscriptions.push(inspectionsSubs);

    let inspectionObservations =  this.dbs.currentDataSecurityInspectionObservations
                                    .subscribe(res => {
                                      this.dataSourceInspectionObservations.data = res;
                                    })

    this.subscriptions.push(inspectionObservations);

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

    this.dbs.getInspections(false, fromDate.valueOf(), toDate.valueOf());

    datepicker.close();
  }

  toggleCardInspection(index, id_inspection) {
    this.requestInspectionObservations(id_inspection);
    this.isOpenInspection[index] = !this.isOpenInspection[index];
  }

  addInspection(): void{
    this.dialog.open(AddInspectionComponent);
  }

  requestInspectionObservations(id): void{
    this.dbs.getInspectionObservations(id);
  }

  addObservation(inspectionData): void{
    this.dialog.open(AddObservationToInspectionComponent, {
      data: inspectionData
    });
  }

  terminateInspection(id_inspection): void{
    console.log(id_inspection);
    this.dialog.open(SecurityInspectionConfirmTerminationComponent,{
      data: {
        id_inspection: id_inspection
      }
    })

  }

  deleteInspection(id_inspection): void{
    this.dialog.open(SecurityInspectionConfirmDeleteComponent, {
      data: {
        id_inspection: id_inspection
      }
    });
  }

  deleteObservation(id_inspection, id_observation): void{
    this.dialog.open(SecurityInspectionObservationConfirmDeleteComponent,{
      data:{
        id_inspection: id_inspection,
        id_observation: id_observation
      }
    })
  }

}
