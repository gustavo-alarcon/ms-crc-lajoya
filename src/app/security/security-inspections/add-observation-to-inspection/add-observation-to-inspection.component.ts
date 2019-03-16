import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InspectionObservationConfirmSaveComponent } from './inspection-observation-confirm-save/inspection-observation-confirm-save.component';

@Component({
  selector: 'app-add-observation-to-inspection',
  templateUrl: './add-observation-to-inspection.component.html',
  styles: []
})
export class AddObservationToInspectionComponent implements OnInit {

  headerDataFormGroup: FormGroup;
  descriptionDataFormGroup: FormGroup;

  filteredAreas: Observable<any>;
  selectedArea: Object = this.data['area'];

  filteredKindOfDanger: Observable<any>;
  filteredKindOfObservation: Observable<any>;
  filteredCauses: Observable<any>;

  selectedFile = null;

  constructor(
    public auth: AuthService,
    public dbs: DatabaseService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddObservationToInspectionComponent>
  ) { }

  ngOnInit() {

    // ************* HEADER FORM GROUP DEFINITIONS

    this.headerDataFormGroup = this.fb.group({
      createdBy: this.auth.userCRC,
      uid: this.auth.userCRC.uid,
      uidSupervisor: this.data['area']['supervisor']['uid'],
      regDate: Date.now(),
      id: '',
      inspectionId:this.data['id'],
      area: [this.data['area'], Validators.required],
      kindOfDanger: ['', Validators.required],
      kindOfObservation: ['', Validators.required],
      cause: ['', Validators.required]
    })

    this.filteredAreas = this.headerDataFormGroup.get('area').valueChanges
                          .pipe(
                            startWith<any>(''),
                            map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                            map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
                          )

    this.filteredKindOfDanger = this.headerDataFormGroup.get('kindOfDanger').valueChanges
                                  .pipe(
                                    startWith<any>(''),
                                    map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                    map(name => name ? this.dbs.kindOfDanger.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.kindOfDanger)
                                  )

    this.filteredKindOfObservation = this.headerDataFormGroup.get('kindOfObservation').valueChanges
                                      .pipe(
                                        startWith<any>(''),
                                        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                        map(name => name ? this.dbs.kindOfObservation.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.kindOfObservation)
                                      )

    this.filteredCauses = this.headerDataFormGroup.get('cause').valueChanges
                                  .pipe(
                                    startWith<any>(''),
                                    map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                                    map(name => name ? this.dbs.causes.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.causes)
                                  )

    // ************* DESCRIPTION FORM GROUP DEFINITIONS

    this.descriptionDataFormGroup = this.fb.group({
      observationDescription: ['', Validators.required],
      recommendationDescription: ['', Validators.required],
    })
  }

  displayArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  setSelectedArea(event): void{
    this.selectedArea = event.option.value;
  }


  addObservation(): void{
    if(!this.selectedFile){
      this.snackbar.open("Adjunte una imagen para poder guardar el documento","Cerrar", {
        duration: 6000
      })
      return;
    }

    if(this.headerDataFormGroup.valid && this.descriptionDataFormGroup.valid){
      this.dialog.open(InspectionObservationConfirmSaveComponent,{
        data: [this.headerDataFormGroup.value, this.descriptionDataFormGroup.value, this.selectedFile, this.data['id']]
      }).afterClosed().subscribe(res => {
        this.dialogRef.close();
      })
    }else{
      this.snackbar.open("Complete todo los campos requeridos para poder guardar el documento","Cerrar", {
        duration: 6000
      });
    }
  }

  onFileSelected(event): void{
    this.selectedFile = event.target.files[0];
  }

}
