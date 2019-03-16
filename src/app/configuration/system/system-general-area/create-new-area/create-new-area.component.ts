import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { MatSnackBar, MatDialogRef } from '@angular/material';

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

  constructor(
    public dialogRef: MatDialogRef<CreateNewAreaComponent>,
    private fb: FormBuilder,
    public dbs: DatabaseService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.newAreaFormGroup = this.fb.group({
      name: ['',Validators.required],
      supervisor:['', Validators.required]
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
  }

  showSelectedSupervisor(staff): string | undefined {
    return staff? staff['displayName'] : undefined;
  }

  selectedSupervisor(event): void{
    
  }

  create(): void{
    this.loading = true;

    let appendInfo = {
      id:'',
      regDate: Date.now()
    };

    let finalObject = Object.assign(this.newAreaFormGroup.value, appendInfo);

    this.dbs.areasCollection.add(finalObject)
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
  }

}
