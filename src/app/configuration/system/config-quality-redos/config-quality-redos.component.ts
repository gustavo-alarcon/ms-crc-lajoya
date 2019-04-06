import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { FormControl } from '@angular/forms';
import { SidenavService } from 'src/app/core/sidenav.service';

@Component({
  selector: 'app-config-quality-redos',
  templateUrl: './config-quality-redos.component.html',
  styles: []
})
export class ConfigQualityRedosComponent implements OnInit {

  qualityComponentsFormControl = new FormControl();
  qualityRedoTypesFormControl = new FormControl();
  qualityComponentModelsFormControl = new FormControl();
  qualityRepairTypesFormControl = new FormControl();
  qualityRootCausesFormControl = new FormControl();
  qualityCauseClassificationsFormControl = new FormControl();

  uploadingQualityComponents: boolean = false;
  uploadingQualityRedoTypes: boolean = false;
  uploadingQualityComponentModels: boolean = false;
  uploadingQualityRepairTypes: boolean = false;
  uploadingQualityRootCauses: boolean = false;
  uploadingQualityCauseClassifications: boolean = false;

  constructor(
    public dbs: DatabaseService,
    public sidenav: SidenavService
  ) { }

  ngOnInit() {
  }

  toggleSidenav(): void{
    this.sidenav.sidenavSystem();
  }

  // List 1
  addQualityComponent(): void{
    if(this.qualityComponentsFormControl.value){
      this.uploadingQualityComponents = true;
      this.dbs.qualityComponentsCollection
      .add({
        name: this.qualityComponentsFormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.uploadingQualityComponents = false;
          this.qualityComponentsFormControl.setValue('');
        })
    }
    
  }

  deleteQualityComponent(id): void{
    this.dbs.qualityComponentsCollection.doc(id).delete();
  }

  // List 2
  addQualityRedoType(): void{
    if(this.qualityRedoTypesFormControl.value){
      this.uploadingQualityRedoTypes = true;
      this.dbs.qualityRedoTypesCollection
      .add({
        name: this.qualityRedoTypesFormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.uploadingQualityRedoTypes = false;
          this.qualityRedoTypesFormControl.setValue('');
        })
    }
    
  }

  deleteQualityRedoType(id): void{
    this.dbs.qualityRedoTypesCollection.doc(id).delete();
  }


  // List 3
  addQualityComponentModel(): void{
    if(this.qualityComponentModelsFormControl.value){
      this.uploadingQualityComponentModels = true;
      this.dbs.qualityComponentModelsCollection
      .add({
        name: this.qualityComponentModelsFormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.uploadingQualityComponentModels = false;
          this.qualityComponentModelsFormControl.setValue('');
        })
    }
    
  }

  deleteQualityComponentModel(id): void{
    this.dbs.qualityComponentModelsCollection.doc(id).delete();
  }

  // List 4
  addQualityRepairType(): void{
    if(this.qualityRepairTypesFormControl.value){
      this.uploadingQualityRepairTypes = true;
      this.dbs.qualityRepairTypesCollection
      .add({
        name: this.qualityRepairTypesFormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.uploadingQualityRepairTypes = false;
          this.qualityRepairTypesFormControl.setValue('');
        })
    }
    
  }

  deleteQualityRepairType(id): void{
    this.dbs.qualityRepairTypesCollection.doc(id).delete();
  }

  // List 5
  addQualityRootCause(): void{
    if(this.qualityRootCausesFormControl.value){
      this.uploadingQualityRootCauses = true;
      this.dbs.qualityRootCausesCollection
      .add({
        name: this.qualityRootCausesFormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.uploadingQualityRootCauses = false;
          this.qualityRootCausesFormControl.setValue('');
        })
    }
    
  }

  deleteQualityRootCause(id): void{
    this.dbs.qualityRootCausesCollection.doc(id).delete();
  }

  // List 6
  addQualityCauseClassification(): void{
    if(this.qualityCauseClassificationsFormControl.value){
      this.uploadingQualityCauseClassifications = true;
      this.dbs.qualityCauseClassificationsCollection
      .add({
        name: this.qualityCauseClassificationsFormControl.value,
        regDate: Date.now()
      })
        .then(ref => {
          ref.update({id: ref.id})
          this.uploadingQualityCauseClassifications = false;
          this.qualityCauseClassificationsFormControl.setValue('');
        })
    }
    
  }

  deleteQualityCauseClassification(id): void{
    this.dbs.qualityCauseClassificationsCollection.doc(id).delete();
  }

}
