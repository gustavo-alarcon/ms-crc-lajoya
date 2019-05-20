import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { QualityConfirmAddSingleObservationComponent } from '../quality-confirm-add-single-observation/quality-confirm-add-single-observation.component';
import { isObjectValidator } from 'src/app/validators/general/is-object-validator';

@Component({
  selector: 'app-quality-dialog-add-single-observation',
  templateUrl: './quality-dialog-add-single-observation.component.html',
  styles: []
})
export class QualityDialogAddSingleObservationComponent implements OnInit {

  headerDataFormGroup: FormGroup;
  descriptionDataFormGroup: FormGroup;

  filteredAreas: Observable<any>;
  selectedArea: Object = {
    area: '',
    supervisor: {
      displayName: '',
      uid: ''
    }
  };
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
    private dialogRef: MatDialogRef<QualityDialogAddSingleObservationComponent>
  ) { }

  ngOnInit() {
    this.headerDataFormGroup = this.fb.group({
      area: ['', [Validators.required, isObjectValidator]],
      responsibleArea: ['', [Validators.required, isObjectValidator]]
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

  // GETTERS
  get area() {
    return this.headerDataFormGroup.get('area');
  }

  get responsibleArea() {
    return this.headerDataFormGroup.get('responsibleArea');
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
      this.dialog.open(QualityConfirmAddSingleObservationComponent, {
        data: [this.headerDataFormGroup.value, this.descriptionDataFormGroup.value, this.selectedFile]
      }).afterClosed().subscribe(res => {
        if (res) {
          this.dialogRef.close(true);
        }
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
