import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-ssgg-requests-pictures',
  templateUrl: './ssgg-requests-pictures.component.html',
  styles: []
})
export class SsggRequestsPicturesComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

}
