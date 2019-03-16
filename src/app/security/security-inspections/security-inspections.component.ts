import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AddInspectionComponent } from './add-inspection/add-inspection.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { map } from 'rxjs/operators';
import { AddObservationToInspectionComponent } from './add-observation-to-inspection/add-observation-to-inspection.component';

@Component({
  selector: 'app-security-inspections',
  templateUrl: './security-inspections.component.html',
  styles: []
})
export class SecurityInspectionsComponent implements OnInit {

  panelOpenState: Array<boolean> = [];

  monthsKey: Array<string> = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  monthIndex: number;
  currentMonth: string;
  currentYear: number;
  year: number;

  monthFormControl = new FormControl({value:new Date(), disabled: true});

  displayedColumns: string[] = ['index', 'terminationDate', 'date', 'inspector', 'area', 'environmentalObservation', 'edit'];
  dataSource = new MatTableDataSource();

  displayedColumnsInspectionObservations: string[] = ['index', 'kindOfDanger', 'kindOfObservation', 'observationDescription', 'initialPicture', 'cause', 'recommendationDescription', 'area', 'terminationDate', 'percent', 'status', 'finalPicture', 'edit'];
  dataSourceInspectionObservations = new MatTableDataSource();

  @ViewChildren(MatPaginator) paginator: MatPaginator;
  @ViewChildren(MatSort) sort: MatSort;

  filteredInspections: Array<any> = [];

  constructor(
    private dialog: MatDialog,
    public dbs: DatabaseService
  ) { }

  ngOnInit() {
    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();

    this.dbs.currentDataSecurityInspections
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
      });

    this.dbs.currentDataSecurityInspectionObservations.subscribe(res => {
      this.dataSourceInspectionObservations.data = res;
    })

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  editInspection(inspectionData): void{

  }

  deleteInspection(inspectionId): void{

  }

}
