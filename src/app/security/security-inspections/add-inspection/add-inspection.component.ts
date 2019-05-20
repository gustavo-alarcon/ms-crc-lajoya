import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { isObjectValidator } from 'src/app/validators/general/is-object-validator';

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
    public auth: AuthService,
    private dialogRef: MatDialogRef<AddInspectionComponent>,
    private snackbar: MatSnackBar

  ) { }

  ngOnInit() {
    this.newInspectionFormGroup = this.fb.group({
      estimatedTerminationDate: ['', Validators.required],
      inspector: ['', [Validators.required, isObjectValidator]],
      area: ['', [Validators.required, isObjectValidator]],
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
                          this.newInspectionFormGroup.get('areaSupervisor').setValue(area['supervisor']['displayName']);
                        }
                      });

    this.subscriptions.push(areaSubs);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * GETTERS
   */

  get inspector() {
    return this.newInspectionFormGroup.get('inspector');
  }

  get area() { 
    return this.newInspectionFormGroup.get('area');
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
      status: 'En espera',
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
          .catch(error => {
            this.loading = false;
            console.log(error);
            this.snackbar.open("Ups!, parece que hubo un error (SI001) ...","Cerrar",{
              duration:6000
            });
          });
        
        // Configuring notification for area supervisor
        let notificationObject = {
          regDate: Date.now(),
          id:'',
          senderId: this.auth.userCRC.uid,
          senderName: this.auth.userCRC.displayName,
          areaId: this.newInspectionFormGroup.value['area']['id'],
          areaName: this.newInspectionFormGroup.value['area']['name'],
          areaSupervisorId: this.newInspectionFormGroup.value['area']['supervisor']['uid'],
          areaSupervisorName: this.newInspectionFormGroup.value['area']['supervisor']['displayName'],
          inspectorId: this.newInspectionFormGroup.value['inspector']['uid'],
          inspectorName: this.newInspectionFormGroup.value['inspector']['displayName'],
          inspectionDate: this.newInspectionFormGroup.value['estimatedTerminationDate'].valueOf(),
          inspectionId: ref.id,
          status: 'unseen',
          type: 'inspection supervisor'
        }

        // Sending notification to area supervisor
        this.dbs.usersCollection
          .doc(this.newInspectionFormGroup.value['area']['supervisor']['uid'])
          .collection('/notifications')
          .add(notificationObject)
            .then(ref => {
              ref.update({id: ref.id});
            })
            .catch(error => {
              this.loading = false;
              console.log(error);
              this.snackbar.open("Ups!, parece que hubo un error (SI001) ...","Cerrar",{
                duration:6000
              });
            });
        
        // Configuring notification for staff
        notificationObject['type'] = 'inspection staff'

        // Sending notification to staff
        this.dbs.usersCollection
          .doc(this.newInspectionFormGroup.value['inspector']['uid'])
          .collection('/notifications')
          .add(notificationObject)
            .then(ref => {
              ref.update({id: ref.id});
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
      });
  }

}
