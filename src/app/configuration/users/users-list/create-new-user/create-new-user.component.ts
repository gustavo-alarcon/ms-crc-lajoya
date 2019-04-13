import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatabaseService } from 'src/app/core/database.service';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styles: []
})
export class CreateNewUserComponent implements OnInit {

  loading: boolean = false;
  newUserFormGroup: FormGroup;

  personalDataFormGroup: FormGroup;
  jobDataFormGroup: FormGroup;

  now: Date = new Date();
  httpOptions;
  data;
  userEmailResults: Array<string> = [];
  coincidence: boolean = false;
  visibility: string = 'password';

  filteredPermits: Observable<any>;
  filteredUsers: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dbs: DatabaseService,
    public dialogRef: MatDialogRef<CreateNewUserComponent>,
    private snackbar: MatSnackBar
  ) {
    this.httpOptions = { headers: new HttpHeaders({
        'Content-type':'application/form-data'
      })
    };
  }

  ngOnInit() {
    

    this.personalDataFormGroup = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      phone: '',
      dni: '',
      password: ['', Validators.required],
    })

    this.jobDataFormGroup = this.fb.group({
      code: '',
      jobTitle: ['', Validators.required],
      supervisor: ['', Validators.required],
      permit: ['', Validators.required]
    })

    this.personalDataFormGroup.get('email').valueChanges.pipe(
      debounceTime(500),
      map(res => {
        this.userEmailResults = this.dbs.users.filter(option => 
          option['email'] === res);
        if(this.userEmailResults.length > 0){
          return true
        }else{
          return false;
        }
      })
    ).subscribe(res => {
      this.coincidence = res;
    })

    this.filteredPermits = this.jobDataFormGroup.get('permit').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                              map(name => name ? this.dbs.permits.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.permits)
                            )

    this.filteredUsers = this.jobDataFormGroup.get('supervisor').valueChanges
                          .pipe(
                            startWith<any>(''),
                            map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
                            map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
                          )
  }

  showSelectedArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  selectedArea(event): void{
    
  }

  showSelectedSupervisor(supervisor): string | undefined {
    return supervisor? supervisor['displayName'] : undefined;
  }

  selectedSupervisor(event): void{
    
  }

  showSelectedPermit(permit): string | undefined {
    return permit? permit['name'] : undefined;
  }

  toggleVisibility(): void{
    if(this.visibility === 'password'){
      this.visibility = 'text';
    }else if(this.visibility === 'text'){
      this.visibility = 'password';
    }
  }

  

  create(): void{
    this.loading = true;
    // this.http.post(`https://us-central1-crclajoya.cloudfunctions.net/msCreateUser/?email=${this.newUserFormGroup.value['email']}&displayName=${this.newUserFormGroup.value['name'].split(" ",1)[0] + ', ' + this.newUserFormGroup.value['lastname'].split(" ",1)[0]}&phoneNumber=${this.newUserFormGroup.value['phone']}&password=${this.newUserFormGroup.value['email'].split("@",1)[0] + this.now.getFullYear()}`
    this.http.post(`https://us-central1-crclajoya.cloudfunctions.net/msCreateUser/?email=${this.personalDataFormGroup.value['email']}&displayName=${this.personalDataFormGroup.value['name'].split(" ",1)[0] + ', ' + this.personalDataFormGroup.value['lastname'].split(" ",1)[0]}&password=${this.personalDataFormGroup.value['password']}`
    ,this.data
    ,this.httpOptions)
    .subscribe(res => {
      if(res['result'] === "ERROR"){
        switch (res['code']) {
          case "auth/email-already-exists":
            this.snackbar.open("Error: Este correo ya existe", "Cerrar",{
              duration: 6000
            });
            this.loading = false;
            break;
        
          default:
            break;
        }
      }
      
      if(res['result'] === "OK"){

        let updateData = {
          displayName: this.personalDataFormGroup.value['name'].split(" ",1)[0] + ', ' + this.personalDataFormGroup.value['lastname'].split(" ",1)[0],
          name: this.personalDataFormGroup.get('name').value,
          lastname: this.personalDataFormGroup.get('lastname').value,
          email: this.personalDataFormGroup.get('email').value,
          phone: this.personalDataFormGroup.get('phone').value,
          dni: this.personalDataFormGroup.get('dni').value,
          password: this.personalDataFormGroup.get('password').value,
          code: this.jobDataFormGroup.get('code').value,
          jobTitle: this.jobDataFormGroup.get('jobTitle').value,
          supervisor: this.jobDataFormGroup.get('supervisor').value,
          permit: this.jobDataFormGroup.get('permit').value,
          uid: res['uid'],
          regDate: Date.now(),
        }

        this.dbs.addUser(updateData)
          .then(() => {
            this.loading = false;
            this.dialogRef.close();
            this.snackbar.open("Usuario creado!","Cerrar");
          })
          .catch(err => {
            console.log(err);
            this.snackbar.open("Ups! parece que hubo un error ...","Cerrar");
          })
      }
      
    })
  }

}
