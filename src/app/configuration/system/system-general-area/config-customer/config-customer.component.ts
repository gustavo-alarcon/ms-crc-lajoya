import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SidenavService } from 'src/app/core/sidenav.service';
import { DatabaseService } from 'src/app/core/database.service';
import { CreateNewCustomerComponent } from './create-new-customer/create-new-customer.component';
import { CustomerDialogEditComponent } from './customer-dialog-edit/customer-dialog-edit.component';
import { CustomerConfirmDeleteComponent } from './customer-confirm-delete/customer-confirm-delete.component';

@Component({
  selector: 'app-config-customer',
  templateUrl: './config-customer.component.html',
  styles: []
})
export class ConfigCustomerComponent implements OnInit {

  displayedColumns: string[] = ['index', 'fullName', 'alias', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filteredCustomers: Array<any> = [];

  constructor(
    public dbs: DatabaseService,
    public sidenav: SidenavService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dbs.currentDataCustomers.subscribe(res => {
      this.filteredCustomers = res;
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
    this.filteredCustomers = this.dbs.customers.filter(option =>       
      option['name'].toLowerCase().includes(ref) ||
      option['alias'].toLowerCase().includes(ref) ) ;

    this.dataSource.data = this.filteredCustomers;
  }

  createNewCustomer(): void{
    this.dialog.open(CreateNewCustomerComponent);
  }

  editCustomer(customer): void{
    this.dialog.open(CustomerDialogEditComponent, {
      data: customer
    })
  }

  deleteCustomer(customer): void{
    this.dialog.open(CustomerConfirmDeleteComponent, {
      data: customer
    })
  }

}
