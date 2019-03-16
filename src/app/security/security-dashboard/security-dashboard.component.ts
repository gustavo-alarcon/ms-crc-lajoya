import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';

@Component({
  selector: 'app-security-dashboard',
  templateUrl: './security-dashboard.component.html',
  styles: []
})
export class SecurityDashboardComponent implements OnInit {

  disableTooltips = new FormControl(true);
  filteredRooms: Array<any> = [];

  displayedColumns: string[] = ['index', 'inspectorName', 'm01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  inspectionsDone: Array<any> = [];

  // LINE CHARTS
  public line1ChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56], label: 'Meta'},
    {data: [28, 48, 40, 19, 86, 27, 90, 65, 59, 85, 80, 57], label: 'Actual'}
  ];

  public bar1ChartData:Array<any> = [
    {data: [28, 48, 40, 19, 86, 27, 90, 65, 59, 85, 80, 57], label: 'Actual'}
  ];

  public bar2ChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56], label: 'Actual'}
  ];

  public lineChartLabels:Array<any> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public lineChartOptions:any = {
    responsive: true
  };
  public barChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(255,196,7,0.7)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(255,196,7,0.7)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];

  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];

  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
  public barChartType:string = 'bar';

  // DOUGHNUT CHART
  public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData:number[] = [350, 450, 100];
  public doughnutChartType:string = 'doughnut';

  //  PIE CHART
  public pieChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData:number[] = [300, 500, 100];
  public pieChartType:string = 'pie';

  now = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  months: Array<string> = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

  constructor() {
    this.currentMonth = this.months[this.now.getMonth()];
    this.currentYear = this.now.getFullYear();
  }

  ngOnInit() {

    this.inspectionsDone = [
      {index:1, inspectorName:'Inspector 1', m01:1, m02:1, m03:1, m04:1, m05:1, m06:1, m07:1, m08:1, m09:1, m10:1, m11:1, m12:1},
      {index:2, inspectorName:'Inspector 2', m01:1, m02:1, m03:0, m04:0, m05:0, m06:1, m07:1, m08:1, m09:1, m10:1, m11:1, m12:1},
      {index:3, inspectorName:'Inspector 3', m01:1, m02:1, m03:1, m04:1, m05:1, m06:'N/P', m07:'N/P', m08:1, m09:1, m10:1, m11:1, m12:'N/P'},
    ]

    this.dataSource.data = this.inspectionsDone;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  nextYear(): void{
    this.currentYear++;
  }

  previewsYear(): void{
    this.currentYear--;
  }

}
