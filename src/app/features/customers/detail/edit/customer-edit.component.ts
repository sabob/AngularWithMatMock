import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from "rxjs";
import AppUtils from "@app/shared/utils/AppUtils";
import {CustomerService} from "@app/features/customers/service/customer.service";
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";
import {MatButtonModule, MatFabButton} from "@angular/material/button";
import {Customer} from "@app/features/customers/shared/models/Customer";
import {Location} from "@angular/common";

@Injectable()
@Component({
  templateUrl: './customer.edit.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatFormField,
    MatLabel,
    MatError,
    MatButtonModule,
    MatFabButton,
    ReactiveFormsModule
  ],
  styleUrls: ['./customer.edit.component.css']
})
export class CustomerEditComponent implements OnInit, OnDestroy {

  private customerSubscription!: Subscription | null;

  customer = new Customer();

  customerForm!: FormGroup;

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private customerService: CustomerService,
              private formBuilder: FormBuilder,
              private location: Location) {
  }

  ngOnInit() {

    this.customer = this.route.snapshot.data['customer'] || new Customer();
    console.log("Resolved Customer", this.customer);

    this.customerForm = this.formBuilder.group({
      uuid: [],
      firstname: ['', [Validators.required, Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.maxLength(100)]],
      idNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(13)]]
    });

    this.updateForm(this.customer);
  }

  ngOnDestroy() {
    this.customerSubscription?.unsubscribe();
  }

  save() {
    //await this.http.get("https://httpstat.us/404?sleep=2000").toPromise();
    AppUtils.validateFormAndMarkAsDirty(this.customerForm);
    if (!this.customerForm?.valid) {
      return;
    }

    // Copy or bind the formData to a Domain object or simply use the form value directly
    //Object.assign(this.customer, this.customerForm.value);
    this.customer = this.customerForm.value as Customer;

    if (this.customer.uuid) {
      console.log("Updating customer: ", this.customer.uuid)
      this.update(this.customer);
    } else {
      console.log("Creating new customer")
      this.create(this.customer);
    }
  }

  updateForm(customer: Customer) {

    try {
      this.customerForm.patchValue(customer);

      if (this.customer.uuid == null && customer?.uuid != null) {
        this.customer.uuid = customer.uuid;
      }

    } catch (err) {
      console.error(err);
    }
  }


  cancelSubmitCustomerRequest() {
    console.log("cancel called")
    this.customerSubscription?.unsubscribe();
    this.customerSubscription = null;
    console.log("unsubscribed")
  }

  private update(customer: Customer) {
    this.customerSubscription?.unsubscribe();
    this.customerSubscription = this.customerService.update(customer).subscribe(customer => {
      console.log("Updated customer: ", customer)
      this.updateForm(customer);
    });
  }

  private create(customer: Customer) {
    this.customerSubscription?.unsubscribe();
    this.customerSubscription = this.customerService.create(customer).subscribe(customer => {
      console.log("Created customer: ", customer)
      this.updateForm(customer);
      AppUtils.addPathToUrl(this.router, this.location, customer.uuid!);
    });
  }
}
