import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CreateNewPermitComponent } from './create-new-permit/create-new-permit.component';
import { AuthService } from 'src/app/core/auth.service';
import { DatabaseService } from 'src/app/core/database.service';

@Component({
  selector: 'app-users-permit-list',
  templateUrl: './users-permit-list.component.html',
  styles: []
})
export class UsersPermitListComponent implements OnInit {

  displayedColumns: string[] = ['index', 'name', 'edit'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filteredPermits: Array<any> = [];

  constructor(
    private dialog: MatDialog,
    public dbs: DatabaseService
  ) { }

  ngOnInit() {
    this.dbs.currentDataPermits.subscribe(res => {
      this.dataSource.data = res;
      this.filteredPermits = res;
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterData(ref): void{
    ref = ref.toLowerCase();
    this.filteredPermits = this.dbs.permits.filter(option =>       
      option['name'].toLowerCase().includes(ref));

    this.dataSource.data = this.filteredPermits;
  }

  createNewPermit():void {
    this.dialog.open(CreateNewPermitComponent);
  }

}
