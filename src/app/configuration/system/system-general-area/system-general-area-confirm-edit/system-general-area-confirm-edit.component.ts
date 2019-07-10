import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-system-general-area-confirm-edit',
  templateUrl: './system-general-area-confirm-edit.component.html',
  styles: []
})
export class SystemGeneralAreaConfirmEditComponent implements OnInit {

  loading: boolean = false;

  constructor(
    public dbs: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<SystemGeneralAreaConfirmEditComponent>
  ) { }

  ngOnInit() {
  }

  save(): void{
    this.loading = true;
    this.dbs.areasCollection
    .doc(this.data['id'])
    .set({name: this.data['name'], supervisor:this.data['supervisor']},{merge:true})
      .then(() => {
        this.loading = false;
        this.dialogRef.close(true);
        this.snackbar.open("Listo!","Cerrar",{
          duration: 6000
        })
      })
      .catch(err => {
        console.log(err);
        this.snackbar.open("Ups...Parece que hubo un error actualizando el área","Cerrar",{
          duration: 6000
        })
      })
    
    let userList = this.dbs.users.slice();

    userList.forEach(user => {

      if(user['area']){

        let area = user['area'];
        let areaId = area['id'];
        
        if( areaId === this.data['id']){
          this.dbs.usersCollection
          .doc(user['uid'])
          .set({area:{name:this.data['name'],supervisor:this.data['supervisor']}},{merge:true})
        }
      }
      

    })
  }

}
