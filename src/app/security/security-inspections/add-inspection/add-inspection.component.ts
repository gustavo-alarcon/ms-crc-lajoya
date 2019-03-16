import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-inspection',
  templateUrl: './add-inspection.component.html',
  styles: []
})
export class AddInspectionComponent implements OnInit {

  newInspectionFormGroup: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    private dialogRef: MatDialogRef<AddInspectionComponent>,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.newInspectionFormGroup = this.fb.group({
      estimatedTerminationDate: ['', Validators.required],
      inspector: ['', Validators.required],
      area: [{supervisor:{displayName:''}}, Validators.required]
    })
  }

  showSelectedInspector(inspector): string | undefined{
    return inspector? inspector['displayName'] : undefined;
  }

  selectedInspector(event): void{
    // NOT USED
  }

  showSelectedArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  selectedArea(event): void{
    // NOT USED
  }

  create(): void{
    this.loading = true;
    let inspectionData = {
      regDate: Date.now(),
      inspector: this.newInspectionFormGroup.value['inspector'],
      area: this.newInspectionFormGroup.value['area'],
      estimatedTerminationDate: this.newInspectionFormGroup.value['estimatedTerminationDate'].valueOf(),
      realTerminationDate: 0,
      environmentalObservation: false,
      status: 'Por confirmar',
      percent: 0,
      id: ''
    }

    this.dbs.addInspection(inspectionData)
      .then(ref => {
        ref.update({id: ref.id})
        this.dbs.addInspectionLog(ref.id, {
          action: 'Inspection creation!',
          description: '',
          regDate: Date.now()
        })
          .then(() => {
            this.loading = false;
            this.dialogRef.close();
            this.snackbar.open("Listo!","Cerrar",{
              duration:6000
            });
          })
          .catch(error => {
            this.loading = false;
            console.log(error);
            this.snackbar.open("Ups!, parece que hubo un error (SI001) ...","Cerrar",{
              duration:6000
            });
          });
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
        this.snackbar.open("Ups!, parece que hubo un error ...","Cerrar",{
          duration:6000
        });
      })
  }

}
