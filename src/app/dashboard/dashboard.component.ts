import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  // LINE CHARTS
  public line1ChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56], label: 'Registrabilidad'}
  ];

  public line2ChartData:Array<any> = [
    {data: [28, 48, 40, 19, 86, 27, 90, 65, 59, 85, 80, 57], label: 'Rehaceres TAD'}
  ];

  public line3ChartData:Array<any> = [
    {data: [18, 48, 77, 9, 100, 27, 40, 65, 59, 76, 84, 58], label: 'Rehaceres TMM'}
  ];

  public lineChartLabels:Array<any> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public lineChartOptions:any = {
    responsive: true
  };
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
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  // DOUGHNUT CHART
  public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData:number[] = [350, 450, 100];
  public doughnutChartType:string = 'doughnut';


  now = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  months: Array<string> = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

  constructor() {
    this.currentMonth = this.months[this.now.getMonth()];
    this.currentYear = this.now.getFullYear();
  }

  ngOnInit() {
  }

  nextYear(): void{
    this.currentYear++;
  }

  previewsYear(): void{
    this.currentYear--;
  }

}
