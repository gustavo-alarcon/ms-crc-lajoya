import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-config-security-fred',
  templateUrl: './config-security-fred.component.html',
  styles: []
})
export class ConfigSecurityFredComponent implements OnInit {

  subAct1FormControl = new FormControl();
  subAct2FormControl = new FormControl();
  subAct3FormControl = new FormControl();
  subAct4FormControl = new FormControl();
  subAct5FormControl = new FormControl();

  constructor(
    public dbs: DatabaseService
  ) { }

  ngOnInit() {
  }

  // List 1
  addSubAct1(): void{
    this.dbs.substandard1Collection
      .add({
        name: this.subAct1FormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.subAct1FormControl.setValue('');
        })
  }

  deleteSubAct1(id): void{
    this.dbs.substandard1Collection.doc(id).delete();
  }

  // List 2
  addSubAct2(): void{
    this.dbs.substandard2Collection
      .add({
        name: this.subAct2FormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.subAct2FormControl.setValue('');
        })
  }

  deleteSubAct2(id): void{
    this.dbs.substandard2Collection.doc(id).delete();
  }

  // List 3
  addSubAct3(): void{
    this.dbs.substandard3Collection
      .add({
        name: this.subAct3FormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.subAct3FormControl.setValue('');
        })
  }

  deleteSubAct3(id): void{
    this.dbs.substandard3Collection.doc(id).delete();
  }

  // List 4
  addSubAct4(): void{
    this.dbs.substandard4Collection
      .add({
        name: this.subAct4FormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.subAct4FormControl.setValue('');
        })
  }

  deleteSubAct4(id): void{
    this.dbs.substandard4Collection.doc(id).delete();
  }

  // List 5
  addSubAct5(): void{
    this.dbs.substandard5Collection
      .add({
        name: this.subAct5FormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.subAct5FormControl.setValue('');
        })
  }

  deleteSubAct5(id): void{
    this.dbs.substandard5Collection.doc(id).delete();
  }

}
