import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatAutocomplete, MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { DatabaseService } from 'src/app/core/database.service';
import { SsggRequestsConfirmEditComponent } from '../ssgg-requests-confirm-edit/ssgg-requests-confirm-edit.component';

@Component({
  selector: 'app-ssgg-requests-dialog-edit',
  templateUrl: './ssgg-requests-dialog-edit.component.html',
  styles: []
})
export class SsggRequestsDialogEditComponent implements OnInit, OnDestroy {

  requestFormGroup: FormGroup;
  additionalsFormGroup: FormGroup;
  taskFormGroup: FormGroup;

  selectedFile_initial = null;
  imageSrc_initial: string | ArrayBuffer;

  selectedFile_final = null;
  imageSrc_final: string | ArrayBuffer;

  filteredSsggTypes: Observable<any>;
  filteredSsggPriorities: Observable<any>;
  filteredAreas: Observable<any>;
  filteredInvolvedAreas: Observable<any>;
  filteredSsggRequests: Array<any>;

  subscriptions: Array<Subscription> = [];

  @ViewChild('involvedAreasInput') involvedAreasInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoInvolvedAreas') matAutocomplete: MatAutocomplete;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  involvedAreasArray: Array<any> = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  progress = new (FormControl);

  statusList: Array<string> = [
    'Por confirmar',
    'Confirmado',
    'Rechazado',
    'En proceso',
    'Finalizado'
  ];

  _estimatedDate: Date;
  percentage: number=0;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SsggRequestsDialogEditComponent>,
    
  ) { }

  ngOnInit() {
    
    this.createForms();
       
    this.filteredSsggTypes =  this.requestFormGroup.get('type').valueChanges
                                .pipe(
                                  startWith<any>(''),
                                  map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                  map(name => name ? this.dbs.ssggTypes.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.ssggTypes)
                                ); 

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
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  createForms(): void{
    this.requestFormGroup = this.fb.group({
      mainArea: [this.data['mainArea'], [Validators.required]],
      type: [this.data['type'], [Validators.required]],
      priority: [this.data['priority'], [Validators.required]],
      resumen: [this.data['resumen'], [Validators.required]],
    });

    this._estimatedDate = new Date(this.data['estimatedTerminationDate']);

    this.additionalsFormGroup = this.fb.group({
      estimatedTerminationDate: [{value: this.data['estimatedTerminationDate']? this._estimatedDate:'', disabled: false}],
      involvedAreas: this.data['involvedAreas'],
      coordinations: this.data['coordinations']
    });

    this.involvedAreasArray = this.data['involvedAreas'];
    
    this.imageSrc_initial = this.data['initialPicture'];
  }

  showSelectedArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  selectedArea(event): void{
    
  }

  // MAT CHIPS WITH AUTOCOMPLETE
  add(event: MatChipInputEvent): void {

    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if(typeof value === 'object'){
        this.involvedAreasArray.push(value);
      }

      if (input) {
        input.value = '';
      }

      this.additionalsFormGroup.get('involvedAreas').setValue('');
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
  //  *********************************************************

  onFileSelected(event): void{
    this.selectedFile_initial = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc_initial = reader.result;

      reader.readAsDataURL(file);
    }
  }

  save(): void{

    if(this.requestFormGroup.valid){

      let dialogRef = this.dialog.open(SsggRequestsConfirmEditComponent,{
        data: {
          form: Object.assign(this.requestFormGroup.value, this.additionalsFormGroup.value),
          requestId: this.data['id'],
          involvedAreas: this.involvedAreasArray,
          initialImage: this.selectedFile_initial
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if(res){
          this.dialogRef.close(true);
        }
      });

    }else{
      this.snackbar.open("Complete todo los campos requeridos para poder guardar el documento","Cerrar", {
        duration: 6000
      });
    }

  }

}
