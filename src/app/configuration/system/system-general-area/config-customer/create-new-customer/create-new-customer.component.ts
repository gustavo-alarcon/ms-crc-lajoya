import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-create-new-customer',
  templateUrl: './create-new-customer.component.html',
  styles: []
})
export class CreateNewCustomerComponent implements OnInit {

  newCustomerFormGroup: FormGroup;
  fullNameResults: Array<string> = [];
  aliasResults: Array<string> = [];
  coincidenceFullName: boolean = false;
  coincidenceAlias: boolean = false;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateNewCustomerComponent>,
    private fb: FormBuilder,
    public dbs: DatabaseService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.newCustomerFormGroup = this.fb.group({
      fullName: ['',Validators.required],
      alias: ['',Validators.required],
    })

    this.newCustomerFormGroup.get('fullName').valueChanges.pipe(
      debounceTime(500),
      map(res => {
        this.fullNameResults = this.dbs.customers.filter(option => 
          option['fullName'] === res);
        if(this.fullNameResults.length > 0){
          return true
        }else{
          return false;
        }
      })
    ).subscribe(res => {
      this.coincidenceFullName = res;
    })


    this.newCustomerFormGroup.get('alias').valueChanges.pipe(
      debounceTime(500),
      map(res => {
        this.aliasResults = this.dbs.areas.filter(option => 
          option['alias'] === res);
        if(this.aliasResults.length > 0){
          return true
        }else{
          return false;
        }
      })
    ).subscribe(res => {
      this.coincidenceAlias = res;
    })

  }

  create(): void{
    this.loading = true;

    let customer = {
      fullName: this.newCustomerFormGroup.value['fullName'],
      alias: this.newCustomerFormGroup.value['alias'],
      regDate: Date.now()
    };

    this.dbs.customersCollection.add(customer)
      .then(ref => {
        ref.update({id: ref.id});
        this.loading = false;
        this.dialogRef.close();
        this.snackbar.open("Listo! ... cliente creado","Cerrar",{
          duration:6000
        })
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
