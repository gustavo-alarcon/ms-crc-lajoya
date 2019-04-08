import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { SidenavService } from 'src/app/core/sidenav.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-config-ssgg-requests',
  templateUrl: './config-ssgg-requests.component.html',
  styles: []
})
export class ConfigSsggRequestsComponent implements OnInit {

  ssggTypesFormControl = new FormControl();
  ssggPrioritiesFormControl = new FormControl();

  uploadingSsggTypes: boolean = false;
  uploadingSsggPriorities: boolean = false;

  constructor(
    public dbs: DatabaseService,
    public sidenav: SidenavService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  toggleSidenav(): void{
    this.sidenav.sidenavSystem();
  }

  // COMPONENTS
  addSsggTypes(): void{
    if(this.ssggTypesFormControl.value){
      this.uploadingSsggTypes = true;
      this.dbs.ssggTypesCollection
      .add({
        name: this.ssggTypesFormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.uploadingSsggTypes = false;
          this.ssggTypesFormControl.setValue('');
        })
    }else{
      this.snackbar.open("Complete la ambos campos (nombre y área) para agregar el componente","Cerrar",{
        duration: 6000
      })
    }
    
  }

  deleteSsggTypes(id): void{
    this.dbs.ssggTypesCollection.doc(id).delete();
  }

  // COMPONENTS
  addSsggPriorities(): void{
    if(this.ssggPrioritiesFormControl.value){
      this.uploadingSsggPriorities = true;
      this.dbs.ssggPrioritiesCollection
      .add({
        name: this.ssggPrioritiesFormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.uploadingSsggPriorities = false;
          this.ssggPrioritiesFormControl.setValue('');
        })
    }else{
      this.snackbar.open("Complete la ambos campos (nombre y área) para agregar el componente","Cerrar",{
        duration: 6000
      })
    }
    
  }

  deleteSsggPriorities(id): void{
    this.dbs.ssggPrioritiesCollection.doc(id).delete();
  }

}
