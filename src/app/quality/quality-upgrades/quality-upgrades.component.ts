import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import { DatabaseService } from 'src/app/core/database.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-quality-upgrades',
  templateUrl: './quality-upgrades.component.html',
  styles: []
})
export class QualityUpgradesComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  now: any = new Date();

  staff: Array<any> = [
    {name: 'Juan', lastname: 'Delgado'},
    {name: 'Luis', lastname: 'Perez'},
    {name: 'Fernando', lastname: 'Colana'}
  ];

  areas: Array<any> = ['Área 1', 'Área 2','Área 3','Área 4'];

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    public dbs: DatabaseService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    this.firstFormGroup = this.fb.group({
      area: ['', Validators.required],
      regDate: [{value:Date.now(), disabled:true}, Validators.required],
      originator: [{value: this.auth.userCRC.name + ', ' + this.auth.userCRC.lastname, disabled: true}, Validators.required],
      owner: ['', Validators.required]
    })

    this.secondFormGroup = this.fb.group({
      descriptionOfIdea: ['', Validators.required],
      caseForIdea: ['', Validators.required],
      solution: ['', Validators.required],
      expectedDate: [Date.now(), Validators.required],
    })

    this.thirdFormGroup = this.fb.group({
      originatorInitSign: [false, Validators.required],
      ownerInitSign: [false, Validators.required],
      completionDate: [0, Validators.required],
      originatorCompletionSign: [false, Validators.required],
      ownerCompletionSign: [false, Validators.required]
    })

  }

  saveAsTask(): void{

  }

  save(): void{
    
  }

}
