import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styles: []
})
export class ConfigurationComponent implements OnInit {

  links = [
    {name:'Usuarios', route:'users'},
    {name:'Sistema', route:'system'},
    {name:'Notificaciones', route:'notifications'}
  ];
  activeLink = this.links[0];

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

 


}
