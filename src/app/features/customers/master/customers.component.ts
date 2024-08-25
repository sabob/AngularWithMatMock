import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Subscription} from "rxjs";
import {CustomerService} from "@app/features/customers/service/customer.service";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {Customer} from "@app/features/customers/shared/models/Customer";
import {AsyncPipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

@Injectable()
@Component({
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    RouterLink,
    AsyncPipe,
    MatIconModule,
  ],
})
export class CustomersComponent implements OnInit, OnDestroy {

  private getCustomersSubscription!: Subscription;

  datasource!: MatTableDataSource<Customer>;

  displayedColumns: string[] = ['position', 'firstname', 'lastname', 'idNumber', 'actions'];

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private customerService: CustomerService) {
  }

  ngOnInit() {
    let customers = this.route.snapshot.data['customers'];
    console.log("Preloaded Customers", customers);

    this.datasource = new MatTableDataSource(customers);
  }

  ngOnDestroy() {
    this.getCustomersSubscription?.unsubscribe();
  }

  loadCustomers() {
    this.getCustomersSubscription?.unsubscribe();
    this.getCustomersSubscription = this.customerService.getCustomers()
      .subscribe((customers => {
        this.datasource = new MatTableDataSource(customers);

      }))
  }
}
