import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-customer-dialog-edit',
  templateUrl: './customer-dialog-edit.component.html',
  styles: []
})
export class CustomerDialogEditComponent implements OnInit {

  newCustomerFormGroup: FormGroup;
  fullNameResults: Array<string> = [];
  aliasResults: Array<string> = [];
  coincidenceFullName: boolean = false;
  coincidenceAlias: boolean = false;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CustomerDialogEditComponent>,
    private fb: FormBuilder,
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.newCustomerFormGroup = this.fb.group({
      fullName: [this.data['fullName'],Validators.required],
      alias: [this.data['alias'],Validators.required],
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

  edit(): void{
    this.loading = true;

    let customer = {
      fullName: this.newCustomerFormGroup.value['fullName'],
      alias: this.newCustomerFormGroup.value['alias'],
    };

    this.dbs.customersCollection.doc(this.data['id']).set(customer,{merge:true})
      .then(ref => {
        this.loading = false;
        this.dialogRef.close();
        this.snackbar.open("Listo! ... cliente editado","Cerrar",{
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
