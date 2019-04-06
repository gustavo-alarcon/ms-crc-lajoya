import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-users-dialog-assign-area',
  templateUrl: './users-dialog-assign-area.component.html',
  styles: []
})
export class UsersDialogAssignAreaComponent implements OnInit {

  areaControl = new FormControl();
  uploading: boolean = false;

  filteredAreas: Observable<any>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<UsersDialogAssignAreaComponent>
  ) { }

  ngOnInit() {
    this.filteredAreas = this.areaControl.valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
        map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
      );
  }

  showSelectedArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  assign(): void{
    this.uploading = true;

    this.dbs.usersCollection
      .doc(this.data['uid'])
      .set({area: this.areaControl.value},{merge:true})
        .then(() => {
          this.uploading = false;
          this.snackbar.open("Listo!","Cerrar",{
            duration: 6000
          });
          this.dialogRef.close(true);
        })
        .catch(err => {
          console.log(err);
          this.snackbar.open("Ups...Parece que hubo un error asignando el área","Cerrar",{
            duration: 6000
          })
        })
  }

}
