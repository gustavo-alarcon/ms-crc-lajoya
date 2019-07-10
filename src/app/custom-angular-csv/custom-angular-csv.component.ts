import { Component } from '@angular/core';
import { Angular2CsvComponent } from 'angular2-csv';

@Component({
  selector: 'app-custom-angular-csv',
  template: '<div (click)=\"onDownload()\"><ng-content></ng-content></div>',
  styles: []
})
export class CustomAngularCsvComponent extends Angular2CsvComponent {}
