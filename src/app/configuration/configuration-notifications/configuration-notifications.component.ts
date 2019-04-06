import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/core/sidenav.service';

@Component({
  selector: 'app-configuration-notifications',
  templateUrl: './configuration-notifications.component.html',
  styles: []
})
export class ConfigurationNotificationsComponent implements OnInit {

  generalOpenedFlag: boolean = false;
  securityOpenedFlag: boolean = false;
  qualityOpenedFlag: boolean = false;
  
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
