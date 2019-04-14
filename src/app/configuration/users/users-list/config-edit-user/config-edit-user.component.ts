import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-config-edit-user',
  templateUrl: './config-edit-user.component.html',
  styles: []
})
export class ConfigEditUserComponent implements OnInit {

  loading: boolean = false;
  newUserFormGroup: FormGroup;

  personalDataFormGroup: FormGroup;
  jobDataFormGroup: FormGroup;

  now: Date = new Date();
  httpOptions;
  _data;
  userEmailResults: Array<string> = [];
  userPhoneResults: Array<string> = [];
  coincidence: boolean = false;
  visibility: string = 'password';

  filteredPermits: Observable<any>;

  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<ConfigEditUserComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    this.createForms();

    this.personalDataFormGroup.get('email').valueChanges.pipe(
      debounceTime(500),
      map(res => {
        this.userEmailResults = this.dbs.users.filter(option => 
          option['email'] === res);
        if(this.userEmailResults.length > 0){
          this.snackbar.open("El correo suministrado, ya existe en la base de datos","Cerrar",{
            duration:6000
          });
          return true
        }else{
          return false;
        }
      })
    ).subscribe(res => {
      this.coincidence = res;
    })

    this.personalDataFormGroup.get('phone').valueChanges.pipe(
      debounceTime(500),
      map(res => {
        this.userPhoneResults = this.dbs.users.filter(option => 
          option['phone'] === ('+51' + res));
        if(this.userEmailResults.length > 0){
          this.snackbar.open("El número celular suministrado, ya existe en la base de datos","Cerrar",{
            duration:6000
          });
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
  }

  createForms(): void{

    this.personalDataFormGroup = this.fb.group({
      name: [this.data['name'], Validators.required],
      lastname: [this.data['lastname'], Validators.required],
      email: [this.data['email'], Validators.required],
      phone: this.data['phone'],
      dni: this.data['dni'],
      password: [this.data['password'], Validators.required],
    })

    this.jobDataFormGroup = this.fb.group({
      code: this.data['code'],
      jobTitle: [this.data['jobTitle'], Validators.required],
      supervisor: [this.data['supervisor'], Validators.required],
      permit: [this.data['permit'], Validators.required]
    })
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

  edit(): void{
    this.loading = true;
    // this.http.post(`https://us-central1-crclajoya.cloudfunctions.net/msCreateUser/?email=${this.newUserFormGroup.value['email']}&displayName=${this.newUserFormGroup.value['name'].split(" ",1)[0] + ', ' + this.newUserFormGroup.value['lastname'].split(" ",1)[0]}&phoneNumber=${this.newUserFormGroup.value['phone']}&password=${this.newUserFormGroup.value['email'].split("@",1)[0] + this.now.getFullYear()}`
    this.http.post(`https://us-central1-crclajoya.cloudfunctions.net/msUpdateUser/?uid=${this.data['uid']}&email=${this.personalDataFormGroup.value['email']}&displayName=${this.personalDataFormGroup.value['name'].split(" ",1)[0] + ', ' + this.personalDataFormGroup.value['lastname'].split(" ",1)[0]}&password=${this.personalDataFormGroup.value['password']}`
    ,this._data
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

          case 'auth/phone-number-already-exists':
            this.snackbar.open("Error: El número suminsitrado, ya existe", "Cerrar",{
              duration: 6000
            });
            this.loading = false;
            break;
        
          default:
            break;
        }
      }

      console.log(res);
      
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
          permit: this.jobDataFormGroup.get('permit').value
        }

        this.dbs.usersCollection
        .doc(this.data['uid'])
        .set(updateData, {merge:true})
          .then(() => {
            this.loading = false;
            this.snackbar.open("Listo!","Cerrar",{
              duration: 6000
            });
            this.dialogRef.close(true);
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
            this.snackbar.open("Ups..Parece que hubo un error actualizando la información de usuario","Cerrar",{
              duration: 6000
            });
          })
      }
    })
  }

}
