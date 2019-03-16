import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styles: []
})
export class UsersListComponent implements OnInit {

  displayedColumns: string[] = ['index', 'displayName', 'email', 'phone', 'permit', 'jobTitle', 'supervisor', 'area', 'edit'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filteredUsers: Array<any> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    this.dbs.currentDataUsers.subscribe(res => {
      this.filteredUsers = res;
      this.dataSource.data = res;
    })

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  filterData(ref: string) {
    ref = ref.toLowerCase();
    this.filteredUsers = this.dbs.users.filter(option =>       
      option['displayName'].toLowerCase().includes(ref) ||
      option['email'].includes(ref) ||
      option['phone'].includes(ref));

    this.dataSource.data = this.filteredUsers;
  }

  createNewUser(): void{
    this.dialog.open(CreateNewUserComponent);
  }

}
