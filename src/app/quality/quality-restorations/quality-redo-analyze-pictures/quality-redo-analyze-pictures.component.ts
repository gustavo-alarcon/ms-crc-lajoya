import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-quality-redo-analyze-pictures',
  templateUrl: './quality-redo-analyze-pictures.component.html',
  styles: []
})
export class QualityRedoAnalyzePicturesComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

}
