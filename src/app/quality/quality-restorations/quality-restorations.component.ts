import { Component, OnInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { RestorationConfirmSaveComponent } from './restoration-confirm-save/restoration-confirm-save.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, Subscription } from 'rxjs';
import { startWith, map, tap } from 'rxjs/operators';
import { DatabaseService } from 'src/app/core/database.service';
import { QualityRedoReportDialogCreateComponent } from './quality-redo-report-dialog-create/quality-redo-report-dialog-create.component';
import { QualityRedoReportDialogAnalyzeComponent } from './quality-redo-report-dialog-analyze/quality-redo-report-dialog-analyze.component';
import { QualityRedoReportDialogEditComponent } from './quality-redo-report-dialog-edit/quality-redo-report-dialog-edit.component';
import { QualityRedoReportConfirmDeleteComponent } from './quality-redo-report-confirm-delete/quality-redo-report-confirm-delete.component';
import { QualityRedoAnalyzePicturesComponent } from './quality-redo-analyze-pictures/quality-redo-analyze-pictures.component';
import { QualityRedoAnalyzeDialogEditComponent } from './quality-redo-analyze-dialog-edit/quality-redo-analyze-dialog-edit.component';
import { QualityRedoAnalyzeConfirmDeleteComponent } from './quality-redo-analyze-confirm-delete/quality-redo-analyze-confirm-delete.component';
import { QualityRedoAnalyzeDialogActionsComponent } from './quality-redo-analyze-dialog-actions/quality-redo-analyze-dialog-actions.component';
import { SelectionModel } from '@angular/cdk/collections';
import { QualityRedoActionsConfirmDeleteActionComponent } from './quality-redo-actions-confirm-delete-action/quality-redo-actions-confirm-delete-action.component';
import { QualityRedoActionsDialogAddActionsComponent } from './quality-redo-actions-dialog-add-actions/quality-redo-actions-dialog-add-actions.component';
import { QualityRedoActionsConfirmApproveActionsComponent } from './quality-redo-actions-confirm-approve-actions/quality-redo-actions-confirm-approve-actions.component';
import { QualityRedoActionsConfirmValidateComponent } from './quality-redo-actions-confirm-validate/quality-redo-actions-confirm-validate.component';
import { QualityRedoActionsConfirmResetComponent } from './quality-redo-actions-confirm-reset/quality-redo-actions-confirm-reset.component';
import { QualityRedoActionsDialogRequestClosingComponent } from './quality-redo-actions-dialog-request-closing/quality-redo-actions-dialog-request-closing.component';
import { QualityRedosActionsConfirmResendComponent } from './quality-redos-actions-confirm-resend/quality-redos-actions-confirm-resend.component';
import { AuthService } from 'src/app/core/auth.service';
import { QualityRedosClosingConfirmClosingComponent } from './quality-redos-closing-confirm-closing/quality-redos-closing-confirm-closing.component';

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
        borderRadius: '8px 8px 0px 0px'
      })),
      state('closedPanel', style({
        borderRadius: '8px'
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
        maxHeight: '300px',
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
  isOpenClosing: Array<any> = [];

  reportFormGroup: FormGroup;

  currentTab = new FormControl(0);
  currentAnalyzeTab = new FormControl(1);
  currentActionsTab = new FormControl(2);

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
  dataSourceRedosAnalyzePanel = new MatTableDataSource();

  displayedColumnsActions: string[] = ['index', 'date', 'initialPicture', 'createdBy', 'area', 'equipment', 'priority', 'observation', 'status', 'finalPicture', 'realTerminationDate', 'maintenanceDetails', 'edit'];
  dataSourceRedosActions = new MatTableDataSource();
  dataSourceRedosActionsPanel = new MatTableDataSource();

  displayedColumnsActionsList: string[] = ['select', 'index', 'action', 'approved', 'responsibles', 'finalPicture', 'status', 'realTerminationDate', 'finalArchive', 'valid', 'delete'];
  dataSourceRedosActionsList = new MatTableDataSource();

  displayedColumnsClosingSignList: string[] = ['index', 'user', 'sign', 'resend'];
  dataSourceRedosClosingSignList = new MatTableDataSource();

  displayedColumnsClosing: string[] = ['index', 'date', 'initialPicture', 'createdBy', 'area', 'equipment', 'priority', 'observation', 'status', 'finalPicture', 'realTerminationDate', 'maintenanceDetails', 'edit'];
  dataSourceRedosClosing = new MatTableDataSource();


  selectedFile = null;
  imageSrc: string | ArrayBuffer;

  filteredAreas: Observable<any>;

  filteredQualityRedosReports: Array<any> = [];

  mobileActionsList: Array<any> = [];

  selection = new SelectionModel(true, []);
  actionsNotApproved: number = 0;
  validatedActions: number = 0;

  allValidated: boolean = false;
  allSigned: boolean = false;

  isTechnician: boolean = false;
  isQualitySupervisor: boolean = false;

  subscriptions: Array<Subscription> = [];


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    public auth: AuthService
  ) {}

  ngOnInit() {

    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();

    this.createForms();

    // checking if you are a technician analyst
    let techSubs = this.dbs.currentDataQualityRedoTechnicians
      .subscribe(res => {
        if(res){
          this.isTechnician = false;
          res.forEach(user => {
            if(user['uid'] === this.auth.userCRC.uid){
              this.isTechnician = true;
            }
          })
        }
      });

    this.subscriptions.push(techSubs);

    // checking if you are a quality supervisor
    let quaSupSubs = this.dbs.currentDataQualityRedoQualityAnalysts
      .subscribe(res => {
        if(res){
          this.isQualitySupervisor = false;
          res.forEach(user => {
            if(user['uid'] === this.auth.userCRC.uid){
              this.isQualitySupervisor = true;
            }
          })
        }
      });

    this.subscriptions.push(quaSupSubs);
    

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
                                      this.isOpenAnalyze.push(false);
                                    })
                                  });

    let dataQualityActionsSubs =  this.dbs.currentDataQualityRedosActions.subscribe(res => {
                                    this.dataSourceRedosActions.data = res;
                                    res.forEach(element => {
                                      this.isOpenActions.push(false);
                                    })
                                  });

    let dataQualityClosingSubs =  this.dbs.currentDataQualityRedosClosing.subscribe(res => {
                                    this.dataSourceRedosClosing.data = res;
                                    res.forEach(element => {
                                      this.isOpenClosing.push(false);
                                    })
                                  });

    

    this.subscriptions.push(dataQualityReportsSubs);
    this.subscriptions.push(dataQualityAnalyzeSubs);
    this.subscriptions.push(dataQualityActionsSubs);
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

    this.dataSourceRedosClosing.paginator = this.paginator.toArray()[3];
    this.dataSourceRedosClosing.sort = this.sort.toArray()[3];
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

    this.dbs.getQualityRedos(fromDate.valueOf(), toDate.valueOf());

    datepicker.close();
  }

  toggleCardReport(index) {
    this.isOpenReport[index] = !this.isOpenReport[index];
  }

  toggleCardAnalyze(index) {
    this.isOpenAnalyze[index] = !this.isOpenAnalyze[index];
  }

  togglePanelAnalyze(index, data) {

    if(this.isOpenAnalyze[index]){
      this.isOpenAnalyze[index] = false;
    }else{
      for (let i = 0; i < this.isOpenAnalyze.length; i++) {
        this.isOpenAnalyze[i] = false;
      }
      this.isOpenAnalyze[index] = true;
    }

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

    this.dataSourceRedosAnalyzePanel.data = [data];


  }

  toggleCardActions(index) {
    this.isOpenActions[index] = !this.isOpenActions[index];
  }

  togglePanelActions(index, data, redoId) {

    if(this.isOpenActions[index]){
      this.isOpenActions[index] = false;
    }else{
      for (let i = 0; i < this.isOpenActions.length; i++) {
        this.isOpenActions[i] = false;
      }
      this.isOpenActions[index] = true;
    }

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

    this.dataSourceRedosActionsPanel.data = [data];

    let actionsSubs= this.dbs.qualityRedosCollection.doc(data['id']).collection('actions').valueChanges()
                        .pipe(
                          tap(res => {
                            this.actionsNotApproved = 0;
                            this.validatedActions = 0;
                            this.selection.clear()
                            this.allValidated = false;
                            this.allSigned = false;
                            res.forEach(element => {
                              if(!element['approved']){
                                this.actionsNotApproved++
                              }
                              if(element['valid']){
                                this.validatedActions++;
                              }
                            })

                            if(this.validatedActions === res.length){
                              this.allValidated = true;
                            }
                          }),
                          map(res => {
                            return res.sort((b,a)=>b['regDate']-a['regDate']);
                          })
                        )
                        .subscribe(res => {
                          this.mobileActionsList = res;
                          this.dataSourceRedosActionsList.data = res;
                        })
    
    this.subscriptions.push(actionsSubs);
    // this.dataSourceRedosActionsList.data = data['actions'];
    this.checkSign(data);


  }

  // toggleCardClosed(index) {
  //   this.isOpenClosed[index] = !this.isOpenClosed[index];
  // }

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

  nextStageActions(redo): void{
    let dialogRef = this.dialog.open(QualityRedoAnalyzeDialogActionsComponent, {
      data: redo,
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(res => {
      if(res === 'Acciones'){
        this.currentTab.setValue(2);
      }
    })
  }

  /*********************** ACTIONS ****************************/

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    //const numRows = this.dataSourceRedosActionsList.data.length;
    return numSelected === this.actionsNotApproved;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSourceRedosActionsList.data.forEach(row => {
          if(!row['approved']){
            this.selection.select(row)
          }
        });
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  deleteAction(action, redo): void{
    this.dialog.open(QualityRedoActionsConfirmDeleteActionComponent,{
      data: {
        redo: redo,
        action: action
      }
    })
  }

  addActions(redo): void{
    this.dialog.open(QualityRedoActionsDialogAddActionsComponent, {
      data: redo,
      autoFocus: false
    })
  }

  approveActions(redo): void{
    this.dialog.open(QualityRedoActionsConfirmApproveActionsComponent, {
      data: {
        redo: redo,
        selection: this.selection.selected
      },
      autoFocus: false
    })
  }

  validateAction(task, redo): void{
    this.dialog.open(QualityRedoActionsConfirmValidateComponent, {
      data:{
        task: task,
        redo: redo
      }
    })
  }

  resetAction(task, redo): void{
    this.dialog.open(QualityRedoActionsConfirmResetComponent, {
      data:{
        task: task,
        redo: redo
      }
    })
  }

  requestClosing(redo): void{
    let dialogRef =this.dialog.open(QualityRedoActionsDialogRequestClosingComponent, {
      data: {
        redo: redo
      }
    })

    dialogRef.afterClosed().subscribe( res => {
      if(res){
        this.currentTab.setValue(3);
      }
    })
  }

  checkSign(redo): void{
    let signingListSubs = this.dbs.qualityRedosCollection.doc(redo['id']).collection('signing').valueChanges().subscribe( res => {
      if(res.length){
        this.dataSourceRedosClosingSignList.data = res;
        let counter = 0;
        this.allSigned = false;
        res.forEach(element => {
          if(element['sign']){
            counter++;
          }
        })

        if(counter === res.length){
          this.allSigned = true;
        }
      }
    })
  }

  resendRequest(user, redo): void{
    this.dialog.open(QualityRedosActionsConfirmResendComponent, {
      data: {
        redo: redo,
        user: user
      }
    })
  }

  closeRedo(redo): void {
    this.dialog.open(QualityRedosClosingConfirmClosingComponent,{
      data: redo
    })
  }

}
