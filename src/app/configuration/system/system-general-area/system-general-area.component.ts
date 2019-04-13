import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { CreateNewAreaComponent } from './create-new-area/create-new-area.component';
import { SystemaGeneralAreaConfirmDeleteComponent } from './systema-general-area-confirm-delete/systema-general-area-confirm-delete.component';
import { SidenavService } from 'src/app/core/sidenav.service';

@Component({
  selector: 'app-system-general-area',
  templateUrl: './system-general-area.component.html',
  styles: []
})
export class SystemGeneralAreaComponent implements OnInit {

  displayedColumns: string[] = ['index', 'name', 'supervisor', 'delete'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filteredAreas: Array<any> = [];

  constructor(
    public dbs: DatabaseService,
    public sidenav: SidenavService,
    private dialog: MatDialog
  ) { 

  }

  ngOnInit() {
    this.dbs.currentDataAreas.subscribe(res => {
      this.filteredAreas = res;
      this.dataSource.data = res;
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggleSidenav(): void{
    this.sidenav.sidenavSystem();
  }

  filterData(ref: string) {
    ref = ref.toLowerCase();
    this.filteredAreas = this.dbs.areas.filter(option =>       
      option['name'].toLowerCase().includes(ref));

    this.dataSource.data = this.filteredAreas;
  }

  createNewArea(): void{
    this.dialog.open(CreateNewAreaComponent);
  }

  deleteArea(area): void{
    this.dialog.open(SystemaGeneralAreaConfirmDeleteComponent, {
      data: area
    })
  }

}
