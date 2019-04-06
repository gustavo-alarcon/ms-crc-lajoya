import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { SidenavService } from 'src/app/core/sidenav.service';

@Component({
  selector: 'app-create-new-area',
  templateUrl: './create-new-area.component.html',
  styles: []
})
export class CreateNewAreaComponent implements OnInit {

  newAreaFormGroup: FormGroup;
  areaNameResults: Array<string> = [];
  coincidence: boolean = false;
  loading: boolean = false;

  supervisorsList: Array<any> = [];

  filteredUsers: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<CreateNewAreaComponent>,
    private fb: FormBuilder,
    public dbs: DatabaseService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.newAreaFormGroup = this.fb.group({
      name: ['',Validators.required],
      supervisor:''
    })

    this.newAreaFormGroup.get('name').valueChanges.pipe(
      debounceTime(500),
      map(res => {
        this.areaNameResults = this.dbs.areas.filter(option => 
          option['name'] === res);
        if(this.areaNameResults.length > 0){
          return true
        }else{
          return false;
        }
      })
    ).subscribe(res => {
      this.coincidence = res;
    })

    this.filteredUsers =  this.newAreaFormGroup.get('supervisor').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
                              map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
                            );
  }

  showSelectedSupervisor(staff): string | undefined {
    return staff? staff['displayName'] : undefined;
  }

  selectedSupervisor(event): void{
    
  }

  addSupervisor(): void{
    if(this.newAreaFormGroup.value['supervisor'] != ''){
      this.supervisorsList.push(this.newAreaFormGroup.value['supervisor']);
      this.newAreaFormGroup.get('supervisor').setValue('');
    }else{
      this.snackbar.open("Debe seleccionar a un usuario","Cerrar",{
        duration: 6000
      })
    }
    
  }

  removeSupervisor(user): void{
    let index = this.supervisorsList.indexOf(user);
    this.supervisorsList.splice(index,1);
  }

  create(): void{
    this.loading = true;

    let area = {
      name: this.newAreaFormGroup.value['name'],
      regDate: Date.now()
    };

    
    this.supervisorsList.forEach(user => {
      area['supervisor'] = user;
      console.log(area);
      this.dbs.areasCollection.add(area)
        .then(ref => {
          ref.update({id: ref.id});
          this.loading = false;
          this.dialogRef.close();
        })
        .catch(error => {
          this.snackbar.open("Error: " + error, "Cerrar", {
            duration: 6000
          })
          console.log(error);
          this.loading = false;
        })
    })

    
  }

}
