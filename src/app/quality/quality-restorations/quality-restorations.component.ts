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
import { QualityRedoAnalyzePicturesComponent } from './quality-redo-analyze-pictures/quality-redo-analyze-pictures.component';
import { QualityRedoAnalyzeDialogEditComponent } from './quality-redo-analyze-dialog-edit/quality-redo-analyze-dialog-edit.component';
import { QualityRedoAnalyzeConfirmDeleteComponent } from './quality-redo-analyze-confirm-delete/quality-redo-analyze-confirm-delete.component';

@Component({
  selector: 'app-quality-restorations',
  templateUrl: './quality-restorations.component.html',
  animations: [
    trigger('openCloseCard',[
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
    ]),
    trigger('openClosePanel',[
      state('openPanel', style({
        borderRadius: '8px 8px 0px 0px',
        marginBottom: '0px'
      })),
      state('closedPanel', style({
        borderRadius: '8px',
        marginBottom: '1em'
      })),
      transition('openPanel => closedPanel', [
        animate('1s ease-in')
      ]),
      transition('closedPanel => openPanel', [
        animate('0.5s ease-in')
      ])
    ]),
    trigger('openClosePanelMobile',[
      state('openPanelMobile', style({
        height: '170px',
        opacity: 0.8,
        borderRadius: '10px 10px 0px 0px',
        marginBottom: '0em'
      })),
      state('closedPanelMobile', style({
        height: '170px',
        opacity: 1,
        borderRadius: '10px 10px 10px 10px',
        marginBottom: '1em'
      })),
      transition('openPanelMobile => closedPanelMobile', [
        animate('1s ease-in')
      ]),
      transition('closedPanelMobile => openPanelMobile', [
        animate('0.5s ease-out')
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
export class QualityRestorationsComponent implements OnInit, OnDestroy {

  isOpenReport: Array<any> = [];
  isOpenAnalyze: Array<any> = [];
  isOpenActions: Array<any> = [];
  isOpenClosed: Array<any> = [];

  reportFormGroup: FormGroup;

  currentTab = new FormControl(0);
  currentAnalyzeTab = new FormControl(1);

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

  displayedColumnsAnalyze: string[] = ['redoType', 'component', 'OTSegment', 'customer', 'repairType', 'hours', 'failureMode', 'rootCause', 'involvedAreas', 'responsibleStaff', 'pictures'];
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
                                  this.dataSourceRedosReports.data = res;
                                  res.forEach(element => {
                                    this.isOpenReport.push(false);
                                  })
                                });

    let dataQualityAnalyzeSubs =  this.dbs.currentDataQualityRedosAnalyze.subscribe(res => {
                                    this.dataSourceRedosAnalyze.data = res;
                                    res.forEach(element => {
                                      this.isOpenReport.push(false);
                                    })
                                  });

    this.subscriptions.push(dataQualityReportsSubs);
    this.subscriptions.push(dataQualityAnalyzeSubs);
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

  togglePanelAnalyze(index, data) {
    this.isOpenAnalyze[index] = !this.isOpenAnalyze[index];

    let pictureCounter = 0;

    if(data['initialPicture']){
      pictureCounter++;
    }
    if(data['image_2']){
      pictureCounter++;
    }
    if(data['image_3']){
      pictureCounter++;
    }
    if(data['image_4']){
      pictureCounter++;
    }
    if(data['image_5']){
      pictureCounter++;
    }

    data['pictureCounter'] = pictureCounter;

    this.dataSourceRedosAnalyze.data = [data];


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
        this.currentTab.setValue(res);
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
        id: id_report,
        uidSupervisor: id_supervisor
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
      if(res === 'Analizar'){
        this.currentTab.setValue(1);
      }
    })
  }

  /*********************** ANALYZE ****************************/

  openPictures(data): void{
    console.log(data);
    this.dialog.open(QualityRedoAnalyzePicturesComponent, {
      data: data
    })
  }

  editAnalyze(redo): void{
    let dialogRef = this.dialog.open(QualityRedoAnalyzeDialogEditComponent,{
      data: redo,
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        dialogRef.close();
      }
    })
  }

  deleteAnalyze(redo): void{
    let dialogRef = this.dialog.open(QualityRedoAnalyzeConfirmDeleteComponent,{
      data: redo,
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.currentAnalyzeTab.setValue(1);
      }
    })
  }

  




}
