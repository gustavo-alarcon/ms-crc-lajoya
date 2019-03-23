import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar, MatChipInputEvent, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DatabaseService } from 'src/app/core/database.service';
import { SsggRequestsConfirmSaveComponent } from './ssgg-requests-confirm-save/ssgg-requests-confirm-save.component';

@Component({
  selector: 'app-ssgg-requests',
  templateUrl: './ssgg-requests.component.html',
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
export class SsggRequestsComponent implements OnInit {

  isOpenRequest: Array<any> = [];

  requestFormGroup: FormGroup;
  additionalsFormGroup: FormGroup;

  selectedFile = null;
  imageSrc: string | ArrayBuffer;

  monthsKey: Array<string> = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  monthIndex: number;
  currentMonth: string;
  currentYear: number;
  year: number;

  monthFormControl = new FormControl({value:new Date(), disabled: true});

  displayedColumnsRequests: string[] = ['index', 'date', 'initialPicture', 'area', 'equipment', 'priority', 'observation', 'finalPicture', 'realTerminationDate', 'maintenanceDetails', 'edit'];
  dataSourceRequests = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filteredSsggTypes: Observable<any>;
  filteredSsggPriorities: Observable<any>;
  filteredAreas: Observable<any>;
  filteredInvolvedAreas: Observable<any>;
  filteredMaintenanceRequests: Array<any>;

  subscriptions: Array<Subscription> = [];

  @ViewChild('involvedAreasInput') involvedAreasInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoInvolvedAreas') matAutocomplete: MatAutocomplete;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  involvedAreasArray: Array<any> = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  mainAreaHint: string;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService
  ) { }

  ngOnInit() {
    
    this.monthIndex = this.monthFormControl.value.getMonth();
    this.currentMonth = this.monthsKey[this.monthIndex];
    this.currentYear = this.monthFormControl.value.getFullYear();

    this.createForms();

    this.filteredSsggTypes =  this.requestFormGroup.get('type').valueChanges
                                .pipe(
                                  startWith<any>(''),
                                  map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                  map(name => name ? this.dbs.ssggTypes.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.ssggTypes)
                                ); 
                                this.requestFormGroup.get('type').setValue(' ');

    this.filteredSsggPriorities = this.requestFormGroup.get('priority').valueChanges
                                    .pipe(
                                      startWith<any>(''),
                                      map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                      map(name => name ? this.dbs.ssggPriorities.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.ssggPriorities)
                                    );

    this.filteredAreas = this.requestFormGroup.get('mainArea').valueChanges
                          .pipe(
                            startWith<any>(''),
                            map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                            map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
                          );

    this.filteredInvolvedAreas = this.additionalsFormGroup.get('involvedAreas').valueChanges
                                  .pipe(
                                    startWith<any>(''),
                                    map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                    map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
                                  );

    // ************** TAB - REQUEST LIST
    let dataSsggRequestsSubs = this.dbs.currentDataMaintenanceRequests.subscribe(res => {
                                        this.filteredMaintenanceRequests = res;
                                        this.dataSourceRequests.data = res;
                                        this.filteredMaintenanceRequests.forEach(element => {
                                          this.isOpenRequest.push(false);
                                        })
                                      });

    this.subscriptions.push(dataSsggRequestsSubs);

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

    if(fromDate.getMonth() + 1 >= 13){
      toYear ++;
    }

    let toDate: Date = new Date(toYear, toMonth, 1);

    this.dbs.getSsggRequests(fromDate.valueOf(), toDate.valueOf());

    datepicker.close();
  }

  createForms(): void{
    this.requestFormGroup = this.fb.group({
      mainArea: ['', [Validators.required]],
      type: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      resumen: ['', [Validators.required]],
    });

    this.additionalsFormGroup = this.fb.group({
      estimatedTerminationDate: ['', [Validators.required]],
      involvedAreas: '',
      coordinations: '',
      moreDetails: ''
    });
  }

  toggleCardRequest(index) {
    this.isOpenRequest[index] = !this.isOpenRequest[index];
  }

  showSelectedArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  selectedArea(event): void{
    this.involvedAreasArray.push(event.option.value);
  }

  // MAT CHIPS WITH AUTOCOMPLETE
  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.involvedAreasArray.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.additionalsFormGroup.get('involvedAreas').setValue(' ');
    }
  }

  remove(area: any): void {
    const index = this.involvedAreasArray.indexOf(area);

    if (index >= 0) {
      this.involvedAreasArray.splice(index, 1);
    }
  }

  selectedInvolvedArea(event: MatAutocompleteSelectedEvent): void {
    this.involvedAreasArray.push(event.option.value);
    this.involvedAreasInput.nativeElement.value = '';
    this.additionalsFormGroup.get('involvedAreas').setValue(' ');
  }
  // ********************************************************

  onFileSelected(event): void{
    this.selectedFile = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);
    }
  }
  
  save(): void{

    if(!this.selectedFile){
      this.snackbar.open("Adjunte una imagen para poder guardar el documento","Cerrar", {
        duration: 6000
      });
      return;
    }

    if(this.requestFormGroup.valid){
      
      this.additionalsFormGroup.get('involvedAreas').setValue(this.involvedAreasArray);
      
      let dialogRef = this.dialog.open(SsggRequestsConfirmSaveComponent,{
        data: {
          form: Object.assign(this.requestFormGroup.value, this.additionalsFormGroup.value),
          image: this.selectedFile
        }
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

}
