import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/core/database.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
import { AuthService } from 'src/app/core/auth.service';
import { SidenavService } from 'src/app/core/sidenav.service';
import { UsersDialogAssignAreaComponent } from '../users-dialog-assign-area/users-dialog-assign-area.component';
import { ConfigEditUserComponent } from './config-edit-user/config-edit-user.component';
import { ConfigDeleteUserComponent } from '../config-delete-user/config-delete-user.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styles: []
})
export class UsersListComponent implements OnInit {

  displayedColumns: string[] = ['index', 'displayName', 'email', 'phone', 'permit', 'jobTitle', 'supervisor', 'assignArea', 'area', 'edit'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filteredUsers: Array<any> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    public sidenav: SidenavService,
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

  toggleSidenav(): void{
    this.sidenav.sidenavUsers();
  }

  filterData(ref: string) {
    ref = ref.toLowerCase();
    this.filteredUsers = this.dbs.users.filter(option =>       
      option['displayName'].toLowerCase().includes(ref) ||
      option['email'].includes(ref));

    this.dataSource.data = this.filteredUsers;
  }

  createNewUser(): void{
    this.dialog.open(CreateNewUserComponent);
  }

  assignArea(user): void{
    this.dialog.open(UsersDialogAssignAreaComponent,{
      data: user
    })
  }

  editUser(user): void{
    this.dialog.open(ConfigEditUserComponent, {
      data: user
    })
  }

  deleteUser(user): void{
    this.dialog.open(ConfigDeleteUserComponent,{
      data: user
    })
  }

}
