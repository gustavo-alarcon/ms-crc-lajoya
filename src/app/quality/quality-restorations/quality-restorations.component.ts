import { Component, OnInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { RestorationConfirmSaveComponent } from './restoration-confirm-save/restoration-confirm-save.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DatabaseService } from 'src/app/core/database.service';
import { QualityRedoReportDialogCreateComponent } from './quality-redo-report-dialog-create/quality-redo-report-dialog-create.component';
import { QualityRedoReportDialogAnalyzeComponent } from './quality-redo-report-dialog-analyze/quality-redo-report-dialog-analyze.component';
import { QualityRedoReportDialogEditComponent } from './quality-redo-report-dialog-edit/quality-redo-report-dialog-edit.component';
import { QualityRedoReportConfirmDeleteComponent } from './quality-redo-report-confirm-delete/quality-redo-report-confirm-delete.component';

@Component({
  selector: 'app-quality-restorations',
  templateUrl: './quality-restorations.component.html',
  animations: [
    trigger('openCloseCard',[
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
    trigger('openCloseContent',[
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
    trigger('openCloseDescription',[
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
export class QualityRestorationsComponent implements OnInit, OnDestroy {

  isOpenReport: Array<any> = [];
  isOpenAnalyze: Array<any> = [];
  isOpenActions: Array<any> = [];
  isOpenClosed: Array<any> = [];

  reportFormGroup: FormGroup;

  currentTab = new FormControl('Reporte');

  monthsKey: Array<string> = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  monthIndex: number;
  currentMonth: string;
  currentYear: number;
  year: number;

  monthFormControl = new FormControl({value:new Date(), disabled: true});

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  displayedColumnsReports: string[] = ['index', 'date', 'createdBy', 'OT', 'area', 'description', 'component', 'initialPicture', 'status', 'edit'];
  dataSourceRedosReports = new MatTableDataSource();

  displayedColumnsAnalyze: string[] = ['index', 'date', 'initialPicture', 'createdBy', 'area', 'equipment', 'priority', 'observation', 'status', 'finalPicture', 'realTerminationDate', 'maintenanceDetails', 'edit'];
  dataSourceRedosAnalyze = new MatTableDataSource();

  displayedColumnsActions: string[] = ['index', 'date', 'initialPicture', 'createdBy', 'area', 'equipment', 'priority', 'observation', 'status', 'finalPicture', 'realTerminationDate', 'maintenanceDetails', 'edit'];
  dataSourceRedosActions = new MatTableDataSource();

  displayedColumnsClosed: string[] = ['index', 'date', 'initialPicture', 'createdBy', 'area', 'equipment', 'priority', 'observation', 'status', 'finalPicture', 'realTerminationDate', 'maintenanceDetails', 'edit'];
  dataSourceRedosClosed = new MatTableDataSource();

  selectedFile = null;
  imageSrc: string | ArrayBuffer;

  filteredAreas: Observable<any>;

  filteredQualityRedosReports: Array<any> = [];

  subscriptions: Array<Subscription> = [];


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService
  ) {}

  ngOnInit() {

    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();

    this.createForms();

    this.filteredAreas = this.reportFormGroup.get('area').valueChanges
                          .pipe(
                            startWith<any>(''),
                            map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                            map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
                          );

    // LIST (1) REPORTS
    let dataQualityReportsSubs = this.dbs.currentDataQualityRedosReports.subscribe(res => {
                                  this.filteredQualityRedosReports = res;
                                  this.dataSourceRedosReports.data = res;
                                  this.filteredQualityRedosReports.forEach(element => {
                                    this.isOpenReport.push(false);
                                  })
                                });

    this.subscriptions.push(dataQualityReportsSubs);

    this.currentTab.valueChanges.subscribe(res => {
      console.log(res);
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit(){
    this.dataSourceRedosReports.paginator = this.paginator.toArray()[0];
    this.dataSourceRedosReports.sort = this.sort.toArray()[0];

    this.dataSourceRedosAnalyze.paginator = this.paginator.toArray()[1];
    this.dataSourceRedosAnalyze.sort = this.sort.toArray()[1];

    this.dataSourceRedosActions.paginator = this.paginator.toArray()[2];
    this.dataSourceRedosActions.sort = this.sort.toArray()[2];

    this.dataSourceRedosClosed.paginator = this.paginator.toArray()[3];
    this.dataSourceRedosClosed.sort = this.sort.toArray()[3];
  }

  toggleCardReport(index) {
    this.isOpenReport[index] = !this.isOpenReport[index];
  }

  toggleCardAnalyze(index) {
    this.isOpenAnalyze[index] = !this.isOpenAnalyze[index];
  }

  toggleCardActions(index) {
    this.isOpenActions[index] = !this.isOpenActions[index];
  }

  toggleCardClosed(index) {
    this.isOpenClosed[index] = !this.isOpenClosed[index];
  }

  createForms(): void{
    this.reportFormGroup = this.fb.group({
      equipment: ['', [Validators.required]],
      area: ['', [Validators.required]],
      observation: ['', [Validators.required]],
      priority: ['', [Validators.required]]
    });
  }

  createReport(): void{
    let dialogRef = this.dialog.open(QualityRedoReportDialogCreateComponent)

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        dialogRef.close();
      }
    })
  }

  editReport(report): void{
    let dialogRef = this.dialog.open(QualityRedoReportDialogEditComponent,{
      data: {
        report: report
      },
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        dialogRef.close();
      }
    })
  }

  deleteReport(id_report, id_supervisor): void{
    let dialogRef = this.dialog.open(QualityRedoReportConfirmDeleteComponent,{
      data: {
        reportId: id_report,
        supervisorId: id_supervisor
      },
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        dialogRef.close();
      }
    })
  }

  nextStageAnalyze(report): void{
    let dialogRef = this.dialog.open(QualityRedoReportDialogAnalyzeComponent, {
      data: {
        report: report,
      },
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        dialogRef.close();
      }
    })
  }

  




}
