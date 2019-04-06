import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatAutocomplete, MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent, MatAutocompleteSelectedEvent, MatTableDataSource } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { startWith, map } from 'rxjs/operators';
import { QualityRedoAnalyzeConfirmActionsComponent } from '../quality-redo-analyze-confirm-actions/quality-redo-analyze-confirm-actions.component';

@Component({
  selector: 'app-quality-redo-analyze-dialog-actions',
  templateUrl: './quality-redo-analyze-dialog-actions.component.html',
  styles: []
})
export class QualityRedoAnalyzeDialogActionsComponent implements OnInit {

  actionsFormGroup: FormGroup;

  filteredUsers: Observable<any>;
  filteredAdditionalUsers: Observable<any>;

  displayedColumnsActions: string[] = ['index', 'action', 'actionResponsibles', 'delete'];
  

  @ViewChild('actionResponsiblesInput') actionsActionResponsiblesInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoActionResponsibles') matAutocompleteResponsibles: MatAutocomplete;

  dataSourceActions = new MatTableDataSource();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  actionsArray: Array<any> = [];
  actionResponsiblesArray: Array<any> = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];

  subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<QualityRedoAnalyzeDialogActionsComponent>
  ) { }

  ngOnInit() {

    this.createForms();

    this.filteredUsers =  this.actionsFormGroup.get('actionResponsibles').valueChanges
                            .pipe(
                              startWith<any>(''),
                              map(value => typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase()),
                              map(name => name ? this.dbs.users.filter(option => option['displayName'].toLowerCase().includes(name)) : this.dbs.users)
                            );

  }

  createForms(): void{
    this.actionsFormGroup = this.fb.group({
      action: ['', [Validators.required]],
      actionResponsibles: '',
    });
  }

  // CHIPS ACTIONS ADDITIONAL RESPONSIBLE STAFF
  addActionResponsibles(event: MatChipInputEvent): void {

    if (!this.matAutocompleteResponsibles.isOpen) {
      const input = event.input;
      const value = event.value;

      if(typeof value === 'object'){
        this.actionResponsiblesArray.push(value);
      }

      if (input) {
        input.value = '';
      }

      this.actionsFormGroup.get('actionResponsibles').setValue('');
    }
  }

  removeActionResponsibles(area: any): void {
    const index = this.actionResponsiblesArray.indexOf(area);

    if (index >= 0) {
      this.actionResponsiblesArray.splice(index, 1);
    }
  }

  selectedActionResponsibles(event: MatAutocompleteSelectedEvent): void {
    this.actionResponsiblesArray.push(event.option.value);
    this.actionsActionResponsiblesInput.nativeElement.value = '';
    this.actionsFormGroup.get('actionResponsibles').setValue(' ');
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
      actionResponsibles: this.actionResponsiblesArray,
      approved:false,
      valid: false,
      finalPicture:'',
      finalArchive:'',
      status:'Por confirmar',
      realTerminationDate: 0
    }
    console.log(action);
    this.actionsArray.push(action);
    console.log(this.actionsArray);
    this.dataSourceActions.data = this.actionsArray;
    this.actionResponsiblesArray = [];
    this.createForms();
  }

  deleteAction(index): void{
    this.actionsArray.splice(index,1)
    this.dataSourceActions.data = this.actionsArray;
  }

  save(): void{

    if(this.actionsArray.length){

      let dialogRef = this.dialog.open(QualityRedoAnalyzeConfirmActionsComponent,{
        data: {
          redo: this.data,
          actions: this.actionsArray
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if(res){
          this.dialogRef.close(res);
        }
      });

    }else{
      this.snackbar.open("Debe agregar por lo menos una acción a la lista para poder guardar el documento","Cerrar", {
        duration: 6000
      });
    }

  }

}
