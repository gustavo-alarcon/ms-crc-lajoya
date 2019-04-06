import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAutocomplete, MatTableDataSource, MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { startWith, map } from 'rxjs/operators';
import { QualityRedoActionsConfirmAddActionsComponent } from '../quality-redo-actions-confirm-add-actions/quality-redo-actions-confirm-add-actions.component';

@Component({
  selector: 'app-quality-redo-actions-dialog-add-actions',
  templateUrl: './quality-redo-actions-dialog-add-actions.component.html',
  styles: []
})
export class QualityRedoActionsDialogAddActionsComponent implements OnInit {

  actionsFormGroup: FormGroup;

  filteredUsers: Observable<any>;
  filteredAdditionalUsers: Observable<any>;

  displayedColumnsActions: string[] = ['index', 'action', 'actionsAdditionalStaff', 'delete'];
  

  @ViewChild('actionsAdditionalStaffInput') actionsAdditionalStaffInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoActionsAdditionalStaff') matAutocompleteStaff: MatAutocomplete;

  dataSourceActions = new MatTableDataSource();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  actionsArray: Array<any> = [];
  actionsAdditionalStaffArray: Array<any> = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];

  subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<QualityRedoActionsDialogAddActionsComponent>
  ) { }

  ngOnInit() {

    this.createForms();

    this.filteredAdditionalUsers =  this.actionsFormGroup.get('actionsAdditionalStaff').valueChanges
                                      .pipe(
                                        startWith<any>(''),
                                        map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
                                        map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
                                      );

  }

  createForms(): void{
    this.actionsFormGroup = this.fb.group({
      action: ['', [Validators.required]],
      actionsAdditionalStaff: '',
    });
  }

  // CHIPS ACTIONS ADDITIONAL RESPONSIBLE STAFF
  addActionsAdditionalStaff(event: MatChipInputEvent): void {

    if (!this.matAutocompleteStaff.isOpen) {
      const input = event.input;
      const value = event.value;

      if(typeof value === 'object'){
        this.actionsAdditionalStaffArray.push(value);
      }

      if (input) {
        input.value = '';
      }

      this.actionsFormGroup.get('actionsAdditionalStaff').setValue('');
    }
  }

  removeActionsAdditionalStaff(area: any): void {
    const index = this.actionsAdditionalStaffArray.indexOf(area);

    if (index >= 0) {
      this.actionsAdditionalStaffArray.splice(index, 1);
    }
  }

  selectedActionsAdditionalStaff(event: MatAutocompleteSelectedEvent): void {
    this.actionsAdditionalStaffArray.push(event.option.value);
    this.actionsAdditionalStaffInput.nativeElement.value = '';
    this.actionsFormGroup.get('actionsAdditionalStaff').setValue(' ');
  }
  //  *********************************************************

  showSelectedResponsible(user): string | undefined {
    return user? user['displayName'] : undefined;
  }

  showSelectedCustomer(customer): string | undefined {
    return customer? customer['fullName'] : undefined;
  }

  addAction(): void{
    let action = {
      action: this.actionsFormGroup.value['action'],
      actionResponsibles:this.actionsAdditionalStaffArray,
      approved:false,
      valid: false,
      finalPicture:'',
      finalArchive:'',
      status:'Por confirmar',
      realTerminationDate: 0
    }
    this.actionsArray.push(action);
    this.dataSourceActions.data = this.actionsArray;
    this.actionsAdditionalStaffArray = [];
  }

  deleteAction(index): void{
    this.actionsArray.splice(index,1)
    this.dataSourceActions.data = this.actionsArray;
  }

  save(): void{

    if(this.actionsFormGroup.valid){

      let dialogRef = this.dialog.open(QualityRedoActionsConfirmAddActionsComponent,{
        data: {
          redo: this.data,
          actions: this.actionsArray,
          additionalStaff: this.actionsAdditionalStaffArray
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if(res){
          this.dialogRef.close(res);
        }
      });

    }else{
      this.snackbar.open("Complete todo los campos requeridos para poder guardar el documento","Cerrar", {
        duration: 6000
      });
    }

  }

}
