import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { SidenavService } from 'src/app/core/sidenav.service';

@Component({
  selector: 'app-config-security-inspections',
  templateUrl: './config-security-inspections.component.html',
  styles: []
})
export class ConfigSecurityInspectionsComponent implements OnInit {

  kindOfDangerFormControl = new FormControl();
  kindOfObservationFormControl = new FormControl();
  causesFormControl = new FormControl();

  constructor(
    public dbs: DatabaseService,
    public sidenav: SidenavService
  ) { }

  ngOnInit() {
  }

  toggleSidenav(): void{
    this.sidenav.sidenavSystem();
  }

  // KIND OF DANGER
  addKindOfDanger(): void{
    this.dbs.kindOfDangerCollection
      .add({
        name: this.kindOfDangerFormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.kindOfDangerFormControl.setValue('');
        })
  }

  deleteKindOfDanger(id): void{
    this.dbs.kindOfDangerCollection.doc(id).delete();
  }

  // KIND OF OBSERVATION
  addKindOfObservation(): void{
    this.dbs.kindOfObservationCollection
      .add({
        name: this.kindOfObservationFormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.kindOfObservationFormControl.setValue('');
        })
  }

  deleteKindOfObservation(id): void{
    this.dbs.kindOfObservationCollection.doc(id).delete();
  }

  // List 3
  addCauses(): void{
    this.dbs.causesCollection
      .add({
        name: this.causesFormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.causesFormControl.setValue('');
        })
  }

  deleteCauses(id): void{
    this.dbs.causesCollection.doc(id).delete();
  }

}
