import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { QualityInspectionObservationConfirmDeleteComponent } from '../quality-inspection-observation-confirm-delete/quality-inspection-observation-confirm-delete.component';
import { QualityConfirmAddObservationComponent } from '../quality-confirm-add-observation/quality-confirm-add-observation.component';

@Component({
  selector: 'app-quality-add-observation-to-inspection',
  templateUrl: './quality-add-observation-to-inspection.component.html',
  styles: []
})
export class QualityAddObservationToInspectionComponent implements OnInit {

  headerDataFormGroup: FormGroup;
  descriptionDataFormGroup: FormGroup;

  filteredAreas: Observable<any>;
  selectedArea: Object = this.data['area'];
  filteredResponsibleAreas: Observable<any>;
  selectedResponsibleArea: Object = {
    name: '',
    supevisor: {
      displayName: ''
    }
  };


  selectedFile = null;
  imageSrc: string | ArrayBuffer;

  constructor(
    public auth: AuthService,
    public dbs: DatabaseService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<QualityAddObservationToInspectionComponent>
  ) { }

  ngOnInit() {

    this.headerDataFormGroup = this.fb.group({
      createdBy: this.auth.userCRC,
      uid: this.auth.userCRC.uid,
      uidSupervisor: this.data['area']['supervisor']['uid'],
      regDate: Date.now(),
      id: '',
      inspectionId: this.data['id'],
      area: [this.data['area'], Validators.required],
      responsibleArea: ['', Validators.required]
    })

    this.filteredAreas = this.headerDataFormGroup.get('area').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
      )

    this.filteredResponsibleAreas = this.headerDataFormGroup.get('responsibleArea').valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
      )

    // ************* DESCRIPTION FORM GROUP DEFINITIONS

    this.descriptionDataFormGroup = this.fb.group({
      observationDescription: ['', Validators.required],
      recommendationDescription: ['', Validators.required],
    })
  }

  displayArea(area): string | undefined {
    return area ? area['name'] : undefined;
  }

  setSelectedArea(event): void {
    this.selectedArea = event.option.value;
  }

  displayResponsibleArea(area): string | undefined {
    return area ? area['name'] : undefined;
  }

  setSelectedResponsibleArea(event): void {
    this.selectedResponsibleArea = event.option.value;
  }

  addObservation(): void {
    if (!this.selectedFile) {
      this.snackbar.open("Adjunte una imagen para poder guardar el documento", "Cerrar", {
        duration: 6000
      })
      return;
    }

    if (this.headerDataFormGroup.valid && this.descriptionDataFormGroup.valid) {
      this.dialog.open(QualityConfirmAddObservationComponent, {
        data: [this.headerDataFormGroup.value, this.descriptionDataFormGroup.value, this.selectedFile, this.data['id']]
      }).afterClosed().subscribe(res => {
        this.dialogRef.close();
      })
    } else {
      this.snackbar.open("Complete todo los campos requeridos para poder guardar el documento", "Cerrar", {
        duration: 6000
      });
    }
  }

  onFileSelected(event): void {
    this.selectedFile = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);
    }
  }

}
