import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { pipe } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styles: []
})
export class ChangePasswordComponent implements OnInit {

  loading: boolean = false;

  password = new FormControl('');
  passwordRepeat = new FormControl('');

  samePassword: boolean = false;

  httpOptions;
  data;

  constructor(
    public auth: AuthService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private snackbar: MatSnackBar,
    private http: HttpClient,
  ) { }

  ngOnInit() {

    this.httpOptions = { headers: new HttpHeaders({
      'Content-type':'application/form-data'
    })
  };

    this.passwordRepeat.valueChanges
      .pipe(
        debounceTime(1000),
        map(res => {
          console.log(res);
          this.samePassword = false;
          if(res === this.password.value){
            this.samePassword = true;
            this.snackbar.open("Bien, las claves son iguales","Cerrar",{
              duration:5000
            })
          }else{
            this.snackbar.open("Las claves deben ser iguales!","Cerrar",{
              duration:5000
            })
          }
          return res;
        })
      )
      .subscribe()
  }

  save(): void{
    if(this.samePassword){

      this.loading = true;
      this.http.post(`https://us-central1-crclajoya.cloudfunctions.net/msUpdatePassword/?uid=${this.auth.userCRC.uid}&password=${this.passwordRepeat.value}`
        ,this.data
        ,this.httpOptions)
        .subscribe(res => {
          if(res['result'] === "ERROR"){
            console.log(res['code'])
            this.loading = false;
            this.dialogRef.close();
            this.snackbar.open("Error al actualizar la clave", "Cerrar",{
              duration: 6000
            });
            
          }
          
          if(res['result'] === "OK"){
            this.loading = false;
            this.dialogRef.close();
            this.snackbar.open("Clave actualizada!","Cerrar");
          }
          
        })
      }

    }
    
  
}
