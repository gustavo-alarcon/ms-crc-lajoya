import { Component, OnInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SaveFredAsTaskComponent } from './save-fred-as-task/save-fred-as-task.component';
import { FredConfirmSaveComponent } from './fred-confirm-save/fred-confirm-save.component';
import { DatabaseService } from 'src/app/core/database.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { FredConfirmDeleteComponent } from './fred-confirm-delete/fred-confirm-delete.component';
import { Subscription, Observable } from 'rxjs';
import { startWith, map, tap } from 'rxjs/operators';
import { FredEditDialogComponent } from './fred-edit-dialog/fred-edit-dialog.component';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-security-fred',
  templateUrl: './security-fred.component.html',
  styles: [],
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
export class SecurityFredComponent implements OnInit, OnDestroy{
  
  isOpenSubstandardAct: Array<any> = [];
  isOpenSubstandardCondition: Array<any> = [];
  isOpenRemarkableAct: Array<any> = [];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  selectedFile = null;
  imageSrc: string | ArrayBuffer;

  monthsKey: Array<string> = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  monthIndex: number;
  currentMonth: string;
  currentYear: number;
  year: number;

  monthFormControl = new FormControl({value:new Date(), disabled: true});

  fredTypes: Array<string> = [
    'Acto sub-estandar',
    'Condición sub-estandar',
    'Acto destacable'
  ]

  displayedColumnsSubstandardAct: string[] = ['index', 'date', 'observations', 'initialPicture', 'observer', 'observedArea', 'staffObserved', 'substandardAct', 'upgradeOpportunity', 'status', 'percent', 'terminationDates', 'finalPicture', 'edit'];
  dataSourceSubstandardAct = new MatTableDataSource();

  displayedColumnsSubstandardCondition: string[] = ['index', 'date', 'initialPicture', 'observer', 'observedArea', 'staffObserved', 'substandardCondition', 'upgradeOpportunity', 'status', 'percent', 'terminationDates', 'finalPicture', 'edit'];
  dataSourceSubstandardCondition = new MatTableDataSource();

  displayedColumnsRemarkableAct: string[] = ['index', 'date', 'initialPicture', 'observer', 'observedArea', 'staffObserved', 'remarkableAct', 'upgradeOpportunity', 'status', 'percent', 'terminationDates', 'finalPicture', 'edit'];
  dataSourceRemarkableAct = new MatTableDataSource();

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  filteredSubstandardActFreds: Array<any> = [];
  filteredSubstandardConditionFreds: Array<any> = [];
  filteredRemarkableActFreds: Array<any> = [];
  filteredFreds: Array<any> = [];

  subscriptions: Array<Subscription> = [];

  filteredTypes: Observable<any>;
  filteredAreas: Observable<any>;
  filteredStaff: Observable<any>;

  filteredObsList1: Observable<any>;
  filteredObsList2: Observable<any>;
  filteredObsList3: Observable<any>;
  filteredObsList4: Observable<any>;
  filteredObsList5: Observable<any>;

  /**
   * TEST
   */

  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: [],
    showTitle: true,
    title: 'asfasf',
    useBom: false,
    removeNewLines: true,
    keys: ['approved','age','name' ]
  };
  data = [
    {
      name: "Test, 1",
      age: 13,
      average: 8.2,
      approved: true,
      description: "using 'Content here, content here' "
    },
    {
      name: 'Test 2',
      age: 11,
      average: 8.2,
      approved: true,
      description: "using 'Content here, content here' "
    },
    {
      name: 'Test 3',
      age: 10,
      average: 8.2,
      approved: true,
      description: "using 'Content here, content here' "
    }
  ];


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    public auth : AuthService
  ) {

    // ****************  TAB - FRED
    this.createForms();

    // ------------ FIRST FORM - AUTCOMPLETE DEFINITIONS

    this.filteredTypes = this.firstFormGroup.get('type').valueChanges
                          .pipe(
                            startWith<any>(''),
                            map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                            map(name => name ? this.fredTypes.filter(option => option.toLowerCase().includes(name)) : this.fredTypes)
                          );

    this.filteredAreas = this.firstFormGroup.get('observedArea').valueChanges
                          .pipe(
                            startWith<any>(''),
                            map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                            map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
                          );

    this.filteredStaff = this.firstFormGroup.get('observedStaff').valueChanges
                          .pipe(
                            startWith<any>(''),
                            map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
                            map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
                          )

    // ------------ SECOND FORM - AUTCOMPLETE DEFINITIONS
    this.filteredObsList1 = this.secondFormGroup.get('list1').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                              map(name => name ? this.dbs.substandard1.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.substandard1)
                            );

    this.filteredObsList2 = this.secondFormGroup.get('list2').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                              map(name => name ? this.dbs.substandard2.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.substandard2)
                            );

    this.filteredObsList3 = this.secondFormGroup.get('list3').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                              map(name => name ? this.dbs.substandard3.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.substandard3)
                            );

    this.filteredObsList4 = this.secondFormGroup.get('list4').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                              map(name => name ? this.dbs.substandard4.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.substandard4)
                            );

    this.filteredObsList5 = this.secondFormGroup.get('list5').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                              map(name => name ? this.dbs.substandard5.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.substandard5)
                            );

    // ****************  TAB - FRED LIST
    let dataSecurityFredsSub =  this.dbs.currentDataSecurityFreds.subscribe(res => {
                                  this.filteredFreds = res;
                                });

    this.subscriptions.push(dataSecurityFredsSub);

    let dataSecurityFredCat1Sub = this.dbs.currentDataSecuritySubstandardActFreds.subscribe(res => {
                                    this.filteredSubstandardActFreds = res;
                                    this.dataSourceSubstandardAct.data = res;
                                    this.filteredSubstandardActFreds.forEach(element => {
                                      this.isOpenSubstandardAct.push(false);
                                    })
                                  })

    this.subscriptions.push(dataSecurityFredCat1Sub);

    let dataSecurityFredCat2Sub = this.dbs.currentDataSecuritySubstandardConditionFreds.subscribe(res => {
                                    this.filteredSubstandardConditionFreds = res;
                                    this.dataSourceSubstandardCondition.data = res;
                                    this.filteredSubstandardConditionFreds.forEach(element => {
                                      this.isOpenSubstandardCondition.push(false);
                                    })
                                  })

    this.subscriptions.push(dataSecurityFredCat2Sub);

    let dataSecurityFredCat3Sub = this.dbs.currentDataSecurityRemarkableActFreds.subscribe(res => {
                                    this.filteredRemarkableActFreds = res;
                                    this.dataSourceRemarkableAct.data = res;
                                    this.filteredRemarkableActFreds.forEach(element => {
                                      this.isOpenRemarkableAct.push(false);
                                    })
                                  })
    
    this.subscriptions.push(dataSecurityFredCat3Sub);
    
  }

  ngOnInit() {
    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

    this.dbs.getSecuritySubstandardActFreds(this.auth.permits['securityFredPersonalList'],fromDate.valueOf(), toDate.valueOf());
    this.dbs.getSecuritySubstandardConditionFreds(this.auth.permits['securityFredPersonalList'],fromDate.valueOf(), toDate.valueOf());
    this.dbs.getSecurityRemarkableActFreds(this.auth.permits['securityFredPersonalList'],fromDate.valueOf(), toDate.valueOf());

    datepicker.close();
  }

  show(event): void{
    console.log(event);
  }

  createForms(): void{
    this.firstFormGroup = this.fb.group({
      type: ['', [Validators.required]],
      observedArea: ['', [Validators.required]],
      observedStaff: ['', [Validators.required]]
    });

    this.secondFormGroup = this.fb.group({
      list1: ['No observado', [Validators.required]],
      list2: ['No observado', [Validators.required]],
      list3: ['No observado', [Validators.required]],
      list4: ['No observado', [Validators.required]],
      list5: ['No observado', [Validators.required]],
    });

    this.thirdFormGroup = this.fb.group({
      solved: false,
      substandardAct: '',
      substandardCondition: '',
      remarkableAct: '',
      upgradeOpportunity: ['',Validators.required]
    });
  }

  ngAfterViewInit(){
    this.dataSourceSubstandardAct.paginator = this.paginator.toArray()[0];
    this.dataSourceSubstandardAct.sort = this.sort.toArray()[0];

    this.dataSourceSubstandardCondition.paginator = this.paginator.toArray()[1];
    this.dataSourceSubstandardCondition.sort = this.sort.toArray()[1];

    this.dataSourceRemarkableAct.paginator = this.paginator.toArray()[2];
    this.dataSourceRemarkableAct.sort = this.sort.toArray()[2];
  }

  toggleCardSubstandardAct(index) {
    this.isOpenSubstandardAct[index] = !this.isOpenSubstandardAct[index];
  }

  toggleCardSubstandardCondition(index) {
    this.isOpenSubstandardCondition[index] = !this.isOpenSubstandardCondition[index];
  }

  toggleCardRemarkableAct(index) {
    this.isOpenRemarkableAct[index] = !this.isOpenRemarkableAct[index];
  }

  showSelectedStaff(staff): string | undefined {
    return staff? staff['displayName'] : undefined;
  }

  selectedStaff(event): void{
    
  }

  showSelectedArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  selectedArea(event): void{
    
  }


  save(): void{

    if(this.firstFormGroup.valid && this.secondFormGroup.valid){
      if(this.thirdFormGroup.value['solved'] === 'true'){
        this.thirdFormGroup.get('solved').setValue(true);
      }

      if(this.thirdFormGroup.value['solved'] === 'false'){
        this.thirdFormGroup.get('solved').setValue(false);
      }

      if(this.firstFormGroup.value['type'] === "Acto sub-estandar"){
        if( this.secondFormGroup.value['list1'] === 'No observado' &&
            this.secondFormGroup.value['list2'] === 'No observado' &&
            this.secondFormGroup.value['list3'] === 'No observado' &&
            this.secondFormGroup.value['list4'] === 'No observado' &&
            this.secondFormGroup.value['list5'] === 'No observado')
        {
          this.snackbar.open("Debe seleccionar por lo menos una OBSERVACIÓN","Cerrar", {
            duration: 6000
          });

          return;
        }
      }

      if(!this.thirdFormGroup.valid){
        this.snackbar.open("Debe sugerir una oportunidad de mejora","Cerrar", {
          duration: 6000
        });

        return;
      }

      if(!this.selectedFile && (this.firstFormGroup.value['type'] === "Condición sub-estandar")){
        this.snackbar.open("Adjunte una imagen para poder guardar el documento","Cerrar", {
          duration: 6000
        });
        return;
      }
      
      let dialogRef = this.dialog.open(FredConfirmSaveComponent,{
        data: [this.firstFormGroup.value, this.secondFormGroup.value, this.thirdFormGroup.value, this.selectedFile]
      });

      dialogRef.afterClosed().subscribe(res => {
        if(res){
          this.createForms();
        }
      });

    }else{
      this.snackbar.open("Complete todo los campos requeridos para poder guardar el documento","Cerrar", {
        duration: 6000
      });
    }

  }

  onFileSelected(event): void{
    this.selectedFile = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);
    }
  }

  delete(id_fred, id_creator, id_staff, id_supervisor): void{

    this.dialog.open(FredConfirmDeleteComponent, {
      data: {
        id_fred: id_fred,
        id_creator: id_creator,
        id_staff: id_staff,
        id_supervisor: id_supervisor
      }
    });
  }

  edit(fred): void{
    this.dialog.open(FredEditDialogComponent,{
      data: fred,
      autoFocus: false
    })
  }

}
