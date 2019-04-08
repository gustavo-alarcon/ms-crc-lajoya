import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { SidenavService } from 'src/app/core/sidenav.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-config-maintenance-requests',
  templateUrl: './config-maintenance-requests.component.html',
  styles: []
})
export class ConfigMaintenanceRequestsComponent implements OnInit {

  maintenanceComponentsFormControl = new FormControl();
  maintenanceAreaFormControl = new FormControl();
  maintenancePrioritiesFormControl = new FormControl();

  uploadingMaintenanceComponents: boolean = false;
  uploadingMaintenancePriorities: boolean = false;

  filteredAreas: Observable<any>;

  constructor(
    public dbs: DatabaseService,
    public sidenav: SidenavService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {

    this.filteredAreas = this.maintenanceAreaFormControl.valueChanges
                          .pipe(
                            startWith<any>(''),
                            map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
                            map(name => name ? this.dbs.areas.filter(option => option['name'].toLowerCase().includes(name)) : this.dbs.areas)
                          );
  }

  toggleSidenav(): void{
    this.sidenav.sidenavSystem();
  }

  showSelectedArea(area): string | undefined {
    return area? area['name'] : undefined;
  }

  // COMPONENTS
  addMaintenanceComponent(): void{
    if(this.maintenanceComponentsFormControl.value && this.maintenanceAreaFormControl.value){
      this.uploadingMaintenanceComponents = true;
      this.dbs.maintenanceEquipmentsConfigCollection
      .add({
        name: this.maintenanceComponentsFormControl.value,
        area: this.maintenanceAreaFormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.uploadingMaintenanceComponents = false;
          this.maintenanceComponentsFormControl.setValue('');
        })
    }else{
      this.snackbar.open("Complete la ambos campos (nombre y área) para agregar el componente","Cerrar",{
        duration: 6000
      })
    }
    
  }

  deleteMaintenanceComponent(id): void{
    this.dbs.maintenanceEquipmentsConfigCollection.doc(id).delete();
  }

  // PRIORITIES
  addMaintenancePriorities(): void{
    if(this.maintenancePrioritiesFormControl.value){
      this.uploadingMaintenancePriorities = true;
      this.dbs.maintenancePrioritiesCollection
      .add({
        name: this.maintenancePrioritiesFormControl.value,
        area: this.maintenanceAreaFormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.uploadingMaintenancePriorities = false;
          this.maintenancePrioritiesFormControl.setValue('');
        })
    }
    
  }

  deleteMaintenancePriorities(id): void{
    this.dbs.maintenancePrioritiesCollection.doc(id).delete();
  }

}
