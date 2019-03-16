import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styles: []
})
export class SystemComponent implements OnInit {

  generalOpenedFlag: boolean;
  securityOpenedFlag: boolean;

  constructor() { }

  ngOnInit() {
  }

  generalOpened(): void{
    this.generalOpenedFlag = true;
  }

  generalClosed(): void{
    this.generalOpenedFlag = false;
  }

  securityOpened(): void{
    this.securityOpenedFlag = true;
  }

  securityClosed(): void{
    this.securityOpenedFlag = false;
  }

}
