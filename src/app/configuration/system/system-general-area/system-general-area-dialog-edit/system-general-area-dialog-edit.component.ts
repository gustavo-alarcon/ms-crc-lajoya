import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { SystemGeneralAreaConfirmEditComponent } from '../system-general-area-confirm-edit/system-general-area-confirm-edit.component';

@Component({
  selector: 'app-system-general-area-dialog-edit',
  templateUrl: './system-general-area-dialog-edit.component.html',
  styles: []
})
export class SystemGeneralAreaDialogEditComponent implements OnInit {

  area = new FormControl(this.data['name']);
  supervisor = new FormControl(this.data['supervisor']);

  coincidence: boolean = false;
  loading: boolean = false;

  filteredUsers: Observable<any>;
  areaNameResults: Array<any> = [];

  constructor(
    public dialogRef: MatDialogRef<SystemGeneralAreaDialogEditComponent>,
    public dbs: DatabaseService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    this.area.valueChanges.pipe(
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

    this.filteredUsers =  this.supervisor.valueChanges
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

  edit(): void{

    if(this.area.value && this.supervisor.value && !this.coincidence){
      this.dialog.open(SystemGeneralAreaConfirmEditComponent,{
        data:{
          id: this.data['id'],
          name: this.area.value,
          supervisor: this.supervisor.value
        }
      }).afterClosed().subscribe(res => {
        if(res){
          this.dialogRef.close()
        }
      })
    }

  }

}
