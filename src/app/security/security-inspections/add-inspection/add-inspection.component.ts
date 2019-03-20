import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-add-inspection',
  templateUrl: './add-inspection.component.html',
  styles: []
})
export class AddInspectionComponent implements OnInit {

  newInspectionFormGroup: FormGroup;
  loading: boolean = false;

  filteredUsers: Observable<any>;
  filteredAreas: Observable<any>;

  subscriptions: Array<Subscription> = [];

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
      area: ['', Validators.required],
      areaSupervisor: [{value:'', disabled:false}]
    });

    this.filteredUsers =  this.newInspectionFormGroup.get('inspector').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
                              map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
                            );

    this.filteredAreas = this.newInspectionFormGroup.get('area').valueChanges
                          .pipe(
                            startWith<any>(''),
                            map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                            map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
                          );

    let areaSubs =  this.newInspectionFormGroup.get('area').valueChanges
                      .pipe(
                        debounceTime(1000)
                      )
                      .subscribe(area => {
                        if(area){
                          console.log(area['supervisor']['displayName']);
                          this.newInspectionFormGroup.get('areaSupervisor').setValue(area['supervisor']['displayName']);
                          console.log(this.newInspectionFormGroup.value['areaSupervisor']);
                        }
                      });

    this.subscriptions.push(areaSubs);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

    // Configuring object inspectionData
    let inspectionData = {
      regDate: Date.now(),
      inspector: this.newInspectionFormGroup.value['inspector'],
      area: this.newInspectionFormGroup.value['area'],
      estimatedTerminationDate: this.newInspectionFormGroup.value['estimatedTerminationDate'].valueOf(),
      realTerminationDate: 0,
      environmentalObservation: false,
      status: 'Por confirmar',
      uidStaff: this.newInspectionFormGroup.value['inspector']['uid'],
      uidAreaSupervisor: this.newInspectionFormGroup.value['area']['supervisor']['uid'],
      id: ''
    }

    // ADDING INSPECTION TO DB
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
