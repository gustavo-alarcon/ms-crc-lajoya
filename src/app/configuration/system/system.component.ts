import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/core/sidenav.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styles: []
})
export class SystemComponent implements OnInit {

  generalOpenedFlag: boolean;
  securityOpenedFlag: boolean;
  qualityOpenedFlag: boolean;
  
  constructor(
    public sidenav: SidenavService
  ) { }

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

  qualityOpened(): void{
    this.qualityOpenedFlag = true;
  }

  qualityClosed(): void{
    this.qualityOpenedFlag = false;
  }

}
