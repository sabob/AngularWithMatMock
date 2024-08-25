import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CustomerService} from "@app/features/customers/service/customer.service";
import {Customer} from "@app/features/customers/shared/models/Customer";
import {Location} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule, MatFabButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Injectable()
@Component({
  templateUrl: './customer-view.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconButton,
    RouterLink,
    MatIcon
  ],
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit, OnDestroy {

  customer = new Customer();

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private customerService: CustomerService,
              private formBuilder: FormBuilder,
              private location: Location) {
  }

  ngOnInit() {
    this.customer = this.route.snapshot.data['customer'] || new Customer();
  }

  ngOnDestroy() {

  }
}
